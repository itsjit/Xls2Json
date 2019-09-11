$Global:DeploymentEnvironment = @{
    SubscriptionId    = "" #TODO: Here specify the subscription Id.
    TenantId          = "" #TODO: Here specify the tenant Id.
    ApplicationId     = "" #TODO: If you have service principal for deployment, then specify the Id.
    ApplicationSecret = "" #TODO: The secret for service principal.

    WebApp            = @{
        ResourceGroupName = "" #TODO: Here specify the Azure resource group for teh Web App.
        WebAppName        = "" #TODO: Here specify the Azure Web App name.
    }
}
Export-ModuleMember -Variable * -Function * -Cmdlet *
