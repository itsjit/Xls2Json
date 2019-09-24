param(
    [Parameter(Position = 0)]
    [ValidateNotNullOrEmpty()]
    [string] 
    $Path = ".\"
)


function Get-MSBuildPath($Version) {
    $vsWhere = "${Env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
    $path = & $vsWhere -latest -requires Microsoft.Component.MSBuild -find MSBuild\**\Bin\MSBuild.exe | select-object -first 1
    return $path
}

function Resolve-ProjectFile($Path) {
    # support :\paths relative - shortcut to "$PSScriptRoot\..\.."
    if ($Path -match '^:\\(.*)$') {
        $Path = (Resolve-Path (Join-Path "$PSScriptRoot\..\.." $Matches[1])).Path
    }

    if (Test-Path $Path -Type Leaf) {
        return $Path
    }

    if (Test-Path $Path -Type Container) {
        $Project = @(Get-ChildItem -LiteralPath $Path -Filter *.csproj)
        
        switch ($Project.Length) {
            0 { throw "No csproj found in '$Path'." }
            1 { return $Project[0].FullName }
            $_ { throw "Multiple csproj's found in '$Path'." }
        }
    }

    throw "'$Path' not found"
}

$ProjectFile = Resolve-Path $Path
#$publishDir = "$(Get-Location)\publish"
$publishDir = "bin\Release\netcoreapp2.2\publish\"
$MSBuild = Get-MSBuildPath

Invoke-Expression "& '$MSBuild' '$ProjectFile' -t:restore"
Invoke-Expression "& '$MSBuild' '$ProjectFile' /p:DeployTarget=MSDeployPublish /p:DeployOnBuild=true /p:Configuration=Release /p:BuildBeforePublish=true /p:WebPublishMethod=FileSystem /p:DeleteExistingFiles=True /p:publishUrl='$publishDir'"
