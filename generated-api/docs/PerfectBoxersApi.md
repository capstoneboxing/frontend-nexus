# PerfectBoxersApi

All URIs are relative to *https://backend-nexus-capstone.up.railway.app*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**generate**](PerfectBoxersApi.md#generate) | **POST** /api/v1/perfect-boxers/generate | Start perfect boxer generation |
| [**getActiveByWeightClassId**](PerfectBoxersApi.md#getactivebyweightclassid) | **GET** /api/v1/perfect-boxers/active/weight-class/{weightClassId} | Get active perfect boxer by weight class |
| [**getAllActivePerfectBoxers**](PerfectBoxersApi.md#getallactiveperfectboxers) | **GET** /api/v1/perfect-boxers/active | Get all active perfect boxers |
| [**getBatchStatus**](PerfectBoxersApi.md#getbatchstatus) | **GET** /api/v1/perfect-boxers/batches/{batchId}/status | Get batch status |
| [**getById1**](PerfectBoxersApi.md#getbyid1) | **GET** /api/v1/perfect-boxers/{id} | Get perfect boxer by ID |
| [**recalculateByWeightClass**](PerfectBoxersApi.md#recalculatebyweightclass) | **POST** /api/v1/perfect-boxers/recalculate/weight-class/{weightClassId} | Regenerate active perfect boxer by weight class |



## generate

> PerfectBoxerGenerationStartedResponse generate(perfectBoxerGenerationRequest)

Start perfect boxer generation

Starts asynchronous perfect boxer generation for a weight class. Requires a valid Bearer JWT.

### Example

```ts
import {
  Configuration,
  PerfectBoxersApi,
} from '';
import type { GenerateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PerfectBoxersApi(config);

  const body = {
    // PerfectBoxerGenerationRequest
    perfectBoxerGenerationRequest: ...,
  } satisfies GenerateRequest;

  try {
    const data = await api.generate(body);
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
| **perfectBoxerGenerationRequest** | [PerfectBoxerGenerationRequest](PerfectBoxerGenerationRequest.md) |  | |

### Return type

[**PerfectBoxerGenerationStartedResponse**](PerfectBoxerGenerationStartedResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Generation started successfully |  -  |
| **404** | Weight class not found |  -  |
| **401** | Authentication required |  -  |
| **500** | Unexpected server error |  -  |
| **400** | Invalid request or validation failed |  -  |
| **403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getActiveByWeightClassId

> PerfectBoxerResponse getActiveByWeightClassId(weightClassId)

Get active perfect boxer by weight class

Returns the currently active perfect boxer for a specific weight class

### Example

```ts
import {
  Configuration,
  PerfectBoxersApi,
} from '';
import type { GetActiveByWeightClassIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PerfectBoxersApi(config);

  const body = {
    // number
    weightClassId: 56,
  } satisfies GetActiveByWeightClassIdRequest;

  try {
    const data = await api.getActiveByWeightClassId(body);
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
| **weightClassId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**PerfectBoxerResponse**](PerfectBoxerResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Active perfect boxer retrieved successfully |  -  |
| **404** | Active perfect boxer or batch not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getAllActivePerfectBoxers

> Array&lt;PerfectBoxerResponse&gt; getAllActivePerfectBoxers()

Get all active perfect boxers

Returns all active perfect boxer records across weight classes

### Example

```ts
import {
  Configuration,
  PerfectBoxersApi,
} from '';
import type { GetAllActivePerfectBoxersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PerfectBoxersApi(config);

  try {
    const data = await api.getAllActivePerfectBoxers();
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

[**Array&lt;PerfectBoxerResponse&gt;**](PerfectBoxerResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Active perfect boxers retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getBatchStatus

> PerfectBoxerBatchStatusResponse getBatchStatus(batchId)

Get batch status

Returns the current status of a perfect boxer generation batch. Requires a valid Bearer JWT.

### Example

```ts
import {
  Configuration,
  PerfectBoxersApi,
} from '';
import type { GetBatchStatusRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PerfectBoxersApi(config);

  const body = {
    // number
    batchId: 56,
  } satisfies GetBatchStatusRequest;

  try {
    const data = await api.getBatchStatus(body);
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
| **batchId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**PerfectBoxerBatchStatusResponse**](PerfectBoxerBatchStatusResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Batch status retrieved successfully |  -  |
| **401** | Authentication required |  -  |
| **404** | Batch not found |  -  |
| **500** | Unexpected server error |  -  |
| **403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getById1

> PerfectBoxerResponse getById1(id)

Get perfect boxer by ID

Returns a fully detailed perfect boxer record including all attributes

### Example

```ts
import {
  Configuration,
  PerfectBoxersApi,
} from '';
import type { GetById1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PerfectBoxersApi(config);

  const body = {
    // number
    id: 56,
  } satisfies GetById1Request;

  try {
    const data = await api.getById1(body);
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

[**PerfectBoxerResponse**](PerfectBoxerResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **404** | Perfect boxer not found |  -  |
| **200** | Perfect boxer retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## recalculateByWeightClass

> PerfectBoxerResponse recalculateByWeightClass(weightClassId)

Regenerate active perfect boxer by weight class

Recalculates the perfect boxer using the active batch for a weight class. Requires a valid Bearer JWT.

### Example

```ts
import {
  Configuration,
  PerfectBoxersApi,
} from '';
import type { RecalculateByWeightClassRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PerfectBoxersApi(config);

  const body = {
    // number
    weightClassId: 56,
  } satisfies RecalculateByWeightClassRequest;

  try {
    const data = await api.recalculateByWeightClass(body);
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
| **weightClassId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**PerfectBoxerResponse**](PerfectBoxerResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Perfect boxer regenerated successfully |  -  |
| **401** | Authentication required |  -  |
| **500** | Unexpected server error |  -  |
| **404** | Active batch not found |  -  |
| **403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

