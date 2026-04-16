# CategoryWeightsApi

All URIs are relative to *https://backend-nexus-capstone.up.railway.app*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getAll**](CategoryWeightsApi.md#getall) | **GET** /api/v1/category-weights | Get all category weights |
| [**getByWeightClassId**](CategoryWeightsApi.md#getbyweightclassid) | **GET** /api/v1/category-weights/weight-class/{weightClassId} | Get category weights by weight class ID |
| [**updateByWeightClassId**](CategoryWeightsApi.md#updatebyweightclassid) | **PUT** /api/v1/category-weights/weight-class/{weightClassId} | Update category weights by weight class ID |



## getAll

> Array&lt;CategoryWeightResponse&gt; getAll()

Get all category weights

Returns all category weight records across all weight classes. Requires a valid Bearer JWT.

### Example

```ts
import {
  Configuration,
  CategoryWeightsApi,
} from '';
import type { GetAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CategoryWeightsApi(config);

  try {
    const data = await api.getAll();
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

[**Array&lt;CategoryWeightResponse&gt;**](CategoryWeightResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **403** | Access denied |  -  |
| **200** | Category weights retrieved successfully |  -  |
| **401** | Authentication required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getByWeightClassId

> CategoryWeightResponse getByWeightClassId(weightClassId)

Get category weights by weight class ID

Returns the category weights for a specific weight class. Requires a valid Bearer JWT.

### Example

```ts
import {
  Configuration,
  CategoryWeightsApi,
} from '';
import type { GetByWeightClassIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CategoryWeightsApi(config);

  const body = {
    // number | Weight class ID
    weightClassId: 11,
  } satisfies GetByWeightClassIdRequest;

  try {
    const data = await api.getByWeightClassId(body);
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
| **weightClassId** | `number` | Weight class ID | [Defaults to `undefined`] |

### Return type

[**CategoryWeightResponse**](CategoryWeightResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **403** | Access denied |  -  |
| **200** | Category weights retrieved successfully |  -  |
| **404** | Category weights not found |  -  |
| **401** | Authentication required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateByWeightClassId

> CategoryWeightResponse updateByWeightClassId(weightClassId, categoryWeightUpdateRequest)

Update category weights by weight class ID

Updates the category weights for a specific weight class. The weights must add up to 1.0. Requires a valid Bearer JWT.

### Example

```ts
import {
  Configuration,
  CategoryWeightsApi,
} from '';
import type { UpdateByWeightClassIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CategoryWeightsApi(config);

  const body = {
    // number | Weight class ID
    weightClassId: 11,
    // CategoryWeightUpdateRequest
    categoryWeightUpdateRequest: ...,
  } satisfies UpdateByWeightClassIdRequest;

  try {
    const data = await api.updateByWeightClassId(body);
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
| **weightClassId** | `number` | Weight class ID | [Defaults to `undefined`] |
| **categoryWeightUpdateRequest** | [CategoryWeightUpdateRequest](CategoryWeightUpdateRequest.md) |  | |

### Return type

[**CategoryWeightResponse**](CategoryWeightResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`, `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **403** | Access denied |  -  |
| **200** | Category weights updated successfully |  -  |
| **404** | Category weights not found |  -  |
| **401** | Authentication required |  -  |
| **400** | Invalid request or weights do not add up to 1.0 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

