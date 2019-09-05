param(
    [string] 
    $ProjectFile = "WebHost.csproj"
)


function Get-MSBuildPath($Version) {
    $vsWhere = "${Env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
    $path = & $vsWhere -latest -requires Microsoft.Component.MSBuild -find MSBuild\**\Bin\MSBuild.exe | select-object -first 1
    return $path
}

$MSBuild = Get-MSBuildPath ""
$MSBuildArgs = New-Object System.Collections.ArrayList
$MSBuildArgs.Add($ProjectFile)
$MSBuildArgs.Add("/p:DeployTarget=MSDeployPublish")
$MSBuildArgs.Add("/p:DeployOnBuild=true")
$MSBuildArgs.Add("/p:Configuration=Release")
$MSBuildArgs.Add("/p:BuildBeforePublish=true")

#$MSBuildArgs.Add("/p:PublishProfile=DefaultPublish")
$MSBuildArgs.Add("/p:WebPublishMethod=FileSystem")
$MSBuildArgs.Add("/p:DeleteExistingFiles=True")
$MSBuildArgs.Add("/p:publishUrl=bin\Release\netcoreapp2.2\publish\")
#$MSBuildArgs.Add("")

& $MSBuild $MSBuildArgs


