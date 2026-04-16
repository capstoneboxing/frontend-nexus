# WeightClassesApi

All URIs are relative to *https://backend-nexus-capstone.up.railway.app*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getWeightClassById**](WeightClassesApi.md#getweightclassbyid) | **GET** /api/v1/weight-classes/{id} | Get weight class by ID |
| [**getWeightClassByName**](WeightClassesApi.md#getweightclassbyname) | **GET** /api/v1/weight-classes/name/{className} | Get weight class by name |
| [**getWeightClasses**](WeightClassesApi.md#getweightclasses) | **GET** /api/v1/weight-classes | Get all weight classes |



## getWeightClassById

> WeightClassResponse getWeightClassById(id)

Get weight class by ID

Returns a single weight class by its ID. This endpoint is public.

### Example

```ts
import {
  Configuration,
  WeightClassesApi,
} from '';
import type { GetWeightClassByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WeightClassesApi();

  const body = {
    // number
    id: 56,
  } satisfies GetWeightClassByIdRequest;

  try {
    const data = await api.getWeightClassById(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

[**WeightClassResponse**](WeightClassResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **500** | Unexpected server error |  -  |
| **404** | Weight class not found |  -  |
| **200** | Weight class found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getWeightClassByName

> WeightClassResponse getWeightClassByName(className)

Get weight class by name

Returns a single weight class by its class name. This endpoint is public.

### Example

```ts
import {
  Configuration,
  WeightClassesApi,
} from '';
import type { GetWeightClassByNameRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WeightClassesApi();

  const body = {
    // string
    className: className_example,
  } satisfies GetWeightClassByNameRequest;

  try {
    const data = await api.getWeightClassByName(body);
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
| **className** | `string` |  | [Defaults to `undefined`] |

### Return type

[**WeightClassResponse**](WeightClassResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **500** | Unexpected server error |  -  |
| **404** | Weight class not found |  -  |
| **200** | Weight class found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getWeightClasses

> Array&lt;WeightClassResponse&gt; getWeightClasses()

Get all weight classes

Returns all boxing weight classes. This endpoint is public.

### Example

```ts
import {
  Configuration,
  WeightClassesApi,
} from '';
import type { GetWeightClassesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WeightClassesApi();

  try {
    const data = await api.getWeightClasses();
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

[**Array&lt;WeightClassResponse&gt;**](WeightClassResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **500** | Unexpected server error |  -  |
| **200** | Weight classes retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

