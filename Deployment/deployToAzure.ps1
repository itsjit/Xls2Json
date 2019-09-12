Import-Module $PSScriptRoot\scripts\AzureAccount.psm1 -Force -ErrorAction Stop
Import-Module $PSScriptRoot\scripts\Publish-WebApp.psm1 -Force -ErrorAction Stop

$secrets = Get-Content "$PSScriptRoot\secrets.json" | ConvertFrom-Json
if (-not $secrets) {
    throw "You must provide environment configuration in 'secrets.json' file."
}
if (-not (Get-InstalledModule -Name Az -AllVersions)) {
    Write-Host "Module 'AZ' has not been found. To install the module, please run: 'Install-Module -Name Az -AllowClobber'."
} 

if (-not [String]::IsNullOrEmpty($secrets.ApplicationSecret)) {
    $applicationSecret = ConvertTo-SecureString `
        $secrets.ApplicationSecret `
        -AsPlainText `
        -Force
}

Submit-LogIn `
    -SubscriptionId $secrets.SubscriptionId `
    -TenantId $secrets.TenantId `
    -ApplicationId $secrets.ApplicationId `
    -ApplicationSecret $applicationSecret

Publish-WebApp `
    -Project           :\WebHost `
    -Name              $secrets.WebApp.WebAppName `
    -ResourceGroupName $secrets.WebApp.ResourceGroupName 
