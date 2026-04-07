# AuthenticationApi

All URIs are relative to *https://backend-nexus-capstone.up.railway.app*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getCurrentAdmin**](AuthenticationApi.md#getcurrentadmin) | **GET** /api/v1/auth/me | Get current authenticated admin |
| [**login**](AuthenticationApi.md#login) | **POST** /api/v1/auth/login | Login |



## getCurrentAdmin

> AdminResponse getCurrentAdmin()

Get current authenticated admin

Returns details of the currently authenticated admin using the JWT token.

### Example

```ts
import {
  Configuration,
  AuthenticationApi,
} from '';
import type { GetCurrentAdminRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AuthenticationApi(config);

  try {
    const data = await api.getCurrentAdmin();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**AdminResponse**](AdminResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **401** | Authentication required |  -  |
| **404** | Admin not found |  -  |
| **500** | Unexpected server error |  -  |
| **403** | Access denied |  -  |
| **200** | Admin retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## login

> AuthResponse login(authRequest)

Login

Authenticates an admin and returns a JWT access token. This endpoint is public.

### Example

```ts
import {
  Configuration,
  AuthenticationApi,
} from '';
import type { LoginRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthenticationApi();

  const body = {
    // AuthRequest
    authRequest: ...,
  } satisfies LoginRequest;

  try {
    const data = await api.login(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **authRequest** | [AuthRequest](AuthRequest.md) |  | |

### Return type

[**AuthResponse**](AuthResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Login successful |  -  |
| **500** | Unexpected server error |  -  |
| **400** | Invalid request or validation failed |  -  |
| **401** | Invalid username or password |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

