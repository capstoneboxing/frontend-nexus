# AllTimeRankedBoxersApi

All URIs are relative to *https://backend-nexus-capstone.up.railway.app*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**generateProfile**](AllTimeRankedBoxersApi.md#generateprofile) | **POST** /api/v1/all-time-ranked-boxers/generate-profile | Generate boxer profile with AI |
| [**getActiveByWeightClassId1**](AllTimeRankedBoxersApi.md#getactivebyweightclassid1) | **GET** /api/v1/all-time-ranked-boxers/active/weight-class/{weightClassId} | Get active ranked boxers by weight class ID |
| [**getAllActive**](AllTimeRankedBoxersApi.md#getallactive) | **GET** /api/v1/all-time-ranked-boxers/active | Get all active ranked boxers |
| [**getAllWithBatchStatus**](AllTimeRankedBoxersApi.md#getallwithbatchstatus) | **GET** /api/v1/all-time-ranked-boxers/with-isActive | Get all ranked boxers with isActive status |
| [**getByBatchId**](AllTimeRankedBoxersApi.md#getbybatchid) | **GET** /api/v1/all-time-ranked-boxers/batch/{batchId} | Get ranked boxers by batch ID |
| [**getById**](AllTimeRankedBoxersApi.md#getbyid) | **GET** /api/v1/all-time-ranked-boxers/{id} | Get ranked boxer by ID |
| [**getByWeightClassId1**](AllTimeRankedBoxersApi.md#getbyweightclassid1) | **GET** /api/v1/all-time-ranked-boxers/weight-class/{weightClassId} | Get ranked boxers by weight class ID |
| [**update**](AllTimeRankedBoxersApi.md#update) | **PUT** /api/v1/all-time-ranked-boxers/{id} | Update ranked boxer |



## generateProfile

> GeneratedBoxerProfileResponse generateProfile(generateBoxerProfileRequest)

Generate boxer profile with AI

Generates a boxer attribute profile for a boxer name and weight class using AI. Requires a valid Bearer JWT.

### Example

```ts
import {
  Configuration,
  AllTimeRankedBoxersApi,
} from '';
import type { GenerateProfileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AllTimeRankedBoxersApi();

  const body = {
    // GenerateBoxerProfileRequest
    generateBoxerProfileRequest: ...,
  } satisfies GenerateProfileRequest;

  try {
    const data = await api.generateProfile(body);
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
| **generateBoxerProfileRequest** | [GenerateBoxerProfileRequest](GenerateBoxerProfileRequest.md) |  | |

### Return type

[**GeneratedBoxerProfileResponse**](GeneratedBoxerProfileResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`, `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **401** | Authentication required |  -  |
| **500** | Unexpected server error |  -  |
| **200** | Boxer profile generated successfully |  -  |
| **400** | Invalid request or validation failed |  -  |
| **404** | Boxer could not be confidently identified |  -  |
| **403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getActiveByWeightClassId1

> Array&lt;AllTimeRankedBoxerResponse&gt; getActiveByWeightClassId1(weightClassId)

Get active ranked boxers by weight class ID

Returns the ranked boxers in the active batch currently used to calculate the perfect boxer for that weight class.

### Example

```ts
import {
  Configuration,
  AllTimeRankedBoxersApi,
} from '';
import type { GetActiveByWeightClassId1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AllTimeRankedBoxersApi();

  const body = {
    // number | Weight class ID
    weightClassId: 11,
  } satisfies GetActiveByWeightClassId1Request;

  try {
    const data = await api.getActiveByWeightClassId1(body);
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

[**Array&lt;AllTimeRankedBoxerResponse&gt;**](AllTimeRankedBoxerResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **404** | No active batch found for weight class |  -  |
| **200** | Active ranked boxers retrieved successfully |  -  |
| **500** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getAllActive

> Array&lt;AllTimeRankedBoxerResponse&gt; getAllActive()

Get all active ranked boxers

Returns all ranked boxers from all active batches across all weight classes.

### Example

```ts
import {
  Configuration,
  AllTimeRankedBoxersApi,
} from '';
import type { GetAllActiveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AllTimeRankedBoxersApi();

  try {
    const data = await api.getAllActive();
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

[**Array&lt;AllTimeRankedBoxerResponse&gt;**](AllTimeRankedBoxerResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Active ranked boxers retrieved successfully |  -  |
| **500** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getAllWithBatchStatus

> Array&lt;AllTimeRankedBoxerWithBatchStatusResponse&gt; getAllWithBatchStatus()

Get all ranked boxers with isActive status

Returns all ranked boxers and indicates whether their batch is active.

### Example

```ts
import {
  Configuration,
  AllTimeRankedBoxersApi,
} from '';
import type { GetAllWithBatchStatusRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AllTimeRankedBoxersApi();

  try {
    const data = await api.getAllWithBatchStatus();
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

[**Array&lt;AllTimeRankedBoxerWithBatchStatusResponse&gt;**](AllTimeRankedBoxerWithBatchStatusResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getByBatchId

> Array&lt;AllTimeRankedBoxerResponse&gt; getByBatchId(batchId)

Get ranked boxers by batch ID

Returns all ranked boxers from a specific generation batch.

### Example

```ts
import {
  Configuration,
  AllTimeRankedBoxersApi,
} from '';
import type { GetByBatchIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AllTimeRankedBoxersApi();

  const body = {
    // number | Batch ID
    batchId: 5,
  } satisfies GetByBatchIdRequest;

  try {
    const data = await api.getByBatchId(body);
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
| **batchId** | `number` | Batch ID | [Defaults to `undefined`] |

### Return type

[**Array&lt;AllTimeRankedBoxerResponse&gt;**](AllTimeRankedBoxerResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **404** | Batch not found |  -  |
| **200** | Ranked boxers retrieved successfully |  -  |
| **500** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getById

> AllTimeRankedBoxerResponse getById(id)

Get ranked boxer by ID

Returns one all-time ranked boxer record by ID.

### Example

```ts
import {
  Configuration,
  AllTimeRankedBoxersApi,
} from '';
import type { GetByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AllTimeRankedBoxersApi();

  const body = {
    // number | Ranked boxer ID
    id: 1,
  } satisfies GetByIdRequest;

  try {
    const data = await api.getById(body);
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
| **id** | `number` | Ranked boxer ID | [Defaults to `undefined`] |

### Return type

[**AllTimeRankedBoxerResponse**](AllTimeRankedBoxerResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **500** | Unexpected server error |  -  |
| **200** | Ranked boxer found |  -  |
| **404** | Ranked boxer not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getByWeightClassId1

> Array&lt;AllTimeRankedBoxerResponse&gt; getByWeightClassId1(weightClassId)

Get ranked boxers by weight class ID

Returns ranked boxer records for a weight class.

### Example

```ts
import {
  Configuration,
  AllTimeRankedBoxersApi,
} from '';
import type { GetByWeightClassId1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AllTimeRankedBoxersApi();

  const body = {
    // number | Weight class ID
    weightClassId: 11,
  } satisfies GetByWeightClassId1Request;

  try {
    const data = await api.getByWeightClassId1(body);
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

[**Array&lt;AllTimeRankedBoxerResponse&gt;**](AllTimeRankedBoxerResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **404** | Weight class not found |  -  |
| **200** | Ranked boxers retrieved successfully |  -  |
| **500** | Unexpected server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## update

> AllTimeRankedBoxerResponse update(id, allTimeRankedBoxerUpdateRequest)

Update ranked boxer

Updates one all-time ranked boxer record. Requires a valid Bearer JWT.

### Example

```ts
import {
  Configuration,
  AllTimeRankedBoxersApi,
} from '';
import type { UpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AllTimeRankedBoxersApi(config);

  const body = {
    // number | Ranked boxer ID
    id: 1,
    // AllTimeRankedBoxerUpdateRequest
    allTimeRankedBoxerUpdateRequest: ...,
  } satisfies UpdateRequest;

  try {
    const data = await api.update(body);
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
| **id** | `number` | Ranked boxer ID | [Defaults to `undefined`] |
| **allTimeRankedBoxerUpdateRequest** | [AllTimeRankedBoxerUpdateRequest](AllTimeRankedBoxerUpdateRequest.md) |  | |

### Return type

[**AllTimeRankedBoxerResponse**](AllTimeRankedBoxerResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`, `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **401** | Authentication required |  -  |
| **200** | Ranked boxer updated successfully |  -  |
| **500** | Unexpected server error |  -  |
| **400** | Invalid request or validation failed |  -  |
| **403** | Access denied |  -  |
| **404** | Ranked boxer not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

