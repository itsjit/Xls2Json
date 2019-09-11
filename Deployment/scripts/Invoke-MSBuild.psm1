$ErrorActionPreference = "Stop"

function Get-MSBuildPath($Version) {
    $vsWhere = "${Env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
    $path = & $vsWhere -latest -requires Microsoft.Component.MSBuild -find MSBuild\**\Bin\MSBuild.exe | select-object -first 1
    return $path
}

function Resolve-ProjectFile($Path) {

    # support :\paths relative to repo root
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

    throw "$Path not found"
}

function Invoke-MSBuild {

    [CmdletBinding()]
    param (

        [Parameter(Mandatory, Position = 0)]
        [String]
        $Project,

        [Parameter(Position = 1)]
        [Hashtable]
        $Property = @{},

        [Parameter()]
        [String[]]
        $Target,

        [Parameter()]
        [String]
        $Version = '15.0'
    )

    $Project = Resolve-ProjectFile $Project

    $MSBuildArgs = New-Object System.Collections.ArrayList
    $MSBuildArgs.Add($Project) | Out-Null

    if ($Target) {
        $MSBuildArgs.Add(
            "/t:$($Target -join ',')"
        ) | Out-Null
    }

    foreach ($Prop in $Property.GetEnumerator()) { 
        $Arg = "/p:$($Prop.Key)=$($Prop.Value)"
        Write-Debug $Arg
        $MSBuildArgs.Add($Arg) | Out-Null
    }

    $MSBuildArgs.Add('/nologo') | Out-Null

    if ($VerbosePreference -eq 'SilentlyContinue') {
        $MSBuildArgs.Add('/verbosity:quiet') | Out-Null
    }
    
    $MSBuild = Get-MSBuildPath $Version

    Write-Debug "MSBuildPath: $MSBuild"
    Write-Debug "MSBuildArgs: $($MSBuildArgs -join ' ')"

    & $MSBuild $MSBuildArgs

    if ($LastExitCode) {
        throw 'MSBuild failed'
    }
}

Export-ModuleMember -Function Invoke-MSBuild
Export-ModuleMember -Function Resolve-ProjectFile