Import-Module $PSScriptRoot\Invoke-MSBuild.psm1 -Force -ErrorAction Stop
$ErrorActionPreference = "Stop"

$null = Add-Type -AssemblyName System.IO.Compression.FileSystem 

function Get-PublishProfile {
   
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [string]
        $Name,

        [Parameter(Mandatory)]
        [string]
        $ResourceGroupName,

        [AllowNull()]
        [AllowEmptyString()]
        [string]
        $SlotName
    ) 

    $TempFile = New-TemporaryFile

    if ([String]::IsNullOrEmpty($SlotName)) {
        $slotParameters = $null
        [xml]$Profile = Get-AzWebAppPublishingProfile `
            -Name $Name `
            -ResourceGroupName $ResourceGroupName `
            -OutputFile $TempFile.FullName `
            -ea Stop
    }
    else {
        $slotParameters = @{ Slot = $SlotName }
        [xml]$Profile = Get-AzWebAppSlotPublishingProfile `
            -Name $Name `
            -ResourceGroupName $ResourceGroupName `
            -OutputFile $TempFile.FullName `
            -ea Stop `
            @slotParameters
    }
        
    Remove-Item `
        -LiteralPath $TempFile.FullName `
        -Confirm:$false `
        -Force `
        -ea Stop

    New-Object PSCustomObject -Property @{
        UserName = $Profile.publishData.publishProfile[0].userName
        Password = $Profile.publishData.publishProfile[0].userPWD
    }
}

function Publish-WebApp {

    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [string]
        $Name,

        [Parameter(Mandatory)]
        [string]
        $ResourceGroupName,

        [Parameter(Mandatory)]
        [String]
        $Project,

        [Parameter(mandatory = $false)]
        $CustomProperties,

        [AllowNull()]
        [AllowEmptyString()]
        [String]
        $SlotName
    )

    Write-Host "Publishing Webb App: $Name."

    $PublishProfile = Get-PublishProfile $Name $ResourceGroupName -SlotName $SlotName

    if ([String]::IsNullOrEmpty($SlotName)) {
        $DeployServiceUrl = "$($Name).scm.azurewebsites.net:443"
    }
    else {
        $DeployServiceUrl = "$($Name)-$SlotName.scm.azurewebsites.net:443"
    }

    $Property = @{
        Configuration                    = 'Release'
        DeployOnBuild                    = 'True'
        DeployIisAppPath                 = $Name
        DeployTarget                     = 'MSDeployPublish'
        EnableMSDeployAppOffline         = 'True'
        EnableMSDeployBackup             = 'True'
        ExcludeApp_Data                  = 'False'
        MSDeployPublishMethod            = 'WMSVC'
        MSDeployServiceURL               = $DeployServiceUrl
        Password                         = $PublishProfile.Password
        ProfileTransformWebConfigEnabled = 'False'
        EnableWebPublishProfileFile      = 'False'
        PublishProvider                  = 'AzureWebSite'
        SkipExtraFilesOnServer           = 'False'
        UserName                         = $PublishProfile.UserName
        WebPublishMethod                 = 'MSDeploy'
        _SavePWD                         = 'True'
        _DestinationType                 = 'AzureWebSite'
    }

    ForEach ($Key in $CustomProperties.Keys) {
        If ($Property.ContainsKey($Key)) {
            $Property[$Key] = $CustomProperties[$Key]
        }
        else {
            $Property.add($Key, $CustomProperties[$Key])
        }
    }

    Invoke-MSBuild `
        -Project $Project `
        -Property $Property `
        -Verbose `
        -ea Stop
}

Export-ModuleMember -Function Publish-WebApp