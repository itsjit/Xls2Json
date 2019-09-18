param(
    [Parameter(Mandatory, Position = 0)]
    [ValidateNotNullOrEmpty()]
    [string] 
    $ProjectFile = "WebHost.csproj"
)


function Get-MSBuildPath($Version) {
    $vsWhere = "${Env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
    $path = & $vsWhere -latest -requires Microsoft.Component.MSBuild -find MSBuild\**\Bin\MSBuild.exe | select-object -first 1
    return $path
}

#$publishDir = "$(Get-Location)\publish"
$publishDir = "bin\Release\netcoreapp2.2\publish\"
$MSBuild = Get-MSBuildPath

Invoke-Expression "& '$MSBuild' '$ProjectFile' -t:restore"
Invoke-Expression "& '$MSBuild' '$ProjectFile' /p:DeployTarget=MSDeployPublish /p:DeployOnBuild=true /p:Configuration=Release /p:BuildBeforePublish=true /p:WebPublishMethod=FileSystem /p:DeleteExistingFiles=True /p:publishUrl='$publishDir'"
