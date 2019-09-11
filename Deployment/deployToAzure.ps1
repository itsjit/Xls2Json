Import-Module $PSScriptRoot\scripts\AzureAccount.psm1 -Force -ErrorAction Stop
Import-Module $PSScriptRoot\scripts\Publish-WebApp.psm1 -Force -ErrorAction Stop
Import-Module $PSScriptRoot\Env.psm1 -Force -ErrorAction Stop

if (-not $DeploymentEnvironment) {
    throw "You must provide environment configuration in 'DeploymentEnvironment' global variable."
}
if (-not (Get-InstalledModule -Name Az -AllVersions)) {
    Write-Host "Module 'AZ' has not been found. To install the module, please run: 'Install-Module -Name Az -AllowClobber'."
} 

if ($null -ne $DeploymentEnvironment.ApplicationSecret) {
    $applicationSecret = ConvertTo-SecureString `
        $DeploymentEnvironment.ApplicationSecret `
        -AsPlainText `
        -Force
}

Submit-LogIn `
    -SubscriptionId $DeploymentEnvironment.SubscriptionId `
    -TenantId $DeploymentEnvironment.TenantId `
    -ApplicationId $DeploymentEnvironment.ApplicationId `
    -ApplicationSecret $applicationSecret

$ResourceGroupName = $DeploymentEnvironment.WebApp.ResourceGroupName
$WebAppName = $DeploymentEnvironment.WebApp.WebAppName

Publish-WebApp `
    -Project           :\WebHost `
    -Name              $WebAppName `
    -ResourceGroupName $ResourceGroupName 
