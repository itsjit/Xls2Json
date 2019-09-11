$ErrorActionPreference = "Stop"

function Submit-LogIn (
    [Parameter(Mandatory, Position = 0)]
    [ValidateNotNullOrEmpty()]
    [String]
    $SubscriptionId,

    [Parameter(Mandatory, Position = 1)]
    [ValidateNotNullOrEmpty()]
    [String]
    $TenantId,

    [Parameter(Mandatory = $false)]
    [String]
    $ApplicationId,

    [Parameter(Mandatory = $false)]
    [securestring]
    $ApplicationSecret
) {
    $allContexts = Get-AzContext -ListAvailable
    $context = $null;

    if ($null -ne $allContexts) {
        if ((-not [String]::IsNullOrEmpty($ApplicationId)) -and (-not [String]::IsNullOrEmpty($ApplicationSecret))) { 
            $context = $allContexts `
            | Where-Object { $_.Subscription.Id -eq $SubscriptionId -and $_.Tenant.Id -eq $TenantId -and $_.Account.Id -eq $ApplicationId } `
            | Select-Object -First 1
        }
        else {
            $context = $allContexts `
            | Where-Object { $_.Subscription.Id -eq $SubscriptionId -and $_.Tenant.Id -eq $TenantId } `
            | Select-Object -First 1
        }
    }

   if ($null -eq $context -and (-not [String]::IsNullOrEmpty($ApplicationId)) -and (-not [String]::IsNullOrEmpty($ApplicationSecret))) { 
        $azureAppCredentials = (New-Object System.Management.Automation.PSCredential $ApplicationId, $ApplicationSecret)
        Connect-AzAccount `
            -ServicePrincipal `
            -SubscriptionId $SubscriptionId `
            -TenantId $TenantId `
            -Credential $azureAppCredentials
        Submit-LogIn `
            -SubscriptionId $SubscriptionId `
            -TenantId $TenantId `
            -ApplicationId $ApplicationId `
            -ApplicationSecret $
    }
    elseif ($null -eq $context) {
        Connect-AzAccount `
            -Tenant $TenantId `
            -SubscriptionId $SubscriptionId
        Submit-LogIn `
            -SubscriptionId $SubscriptionId `
            -TenantId $TenantId 
    }
    else {
        Select-AzContext `
            -Name $context.name
        Write-Host "Using context: $($context.Name)"
        
        try {
            $resourceGroups = Get-AzResourceGroup
            return $null;
        }
        catch {
            if ($_.Exception.InnerException.InnerException.ErrorCode -eq "failed_to_acquire_token_silently") {
                Submit-LogIn `
                    -SubscriptionId $SubscriptionId `
                    -TenantId $TenantId `
                    -Interactive
            }
            else {
                throw
            }
        }
    }
}

Export-ModuleMember -Function *
