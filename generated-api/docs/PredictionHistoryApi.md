# PredictionHistoryApi

All URIs are relative to *https://backend-nexus-capstone.up.railway.app*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deletePredictionHistory**](PredictionHistoryApi.md#deletepredictionhistory) | **DELETE** /api/v1/prediction-history/{id} | Delete prediction history |
| [**getPredictionHistories**](PredictionHistoryApi.md#getpredictionhistories) | **GET** /api/v1/prediction-history | Get all prediction history |
| [**getPredictionHistoryById**](PredictionHistoryApi.md#getpredictionhistorybyid) | **GET** /api/v1/prediction-history/{id} | Get prediction history by ID |
| [**updatePredictionHistory**](PredictionHistoryApi.md#updatepredictionhistory) | **PUT** /api/v1/prediction-history/{id} | Update prediction history |



## deletePredictionHistory

> deletePredictionHistory(id)

Delete prediction history

Deletes a saved prediction history record by ID. Requires a valid Bearer JWT.

### Example

```ts
import {
  Configuration,
  PredictionHistoryApi,
} from '';
import type { DeletePredictionHistoryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PredictionHistoryApi(config);

  const body = {
    // number | Prediction history ID
    id: 1,
  } satisfies DeletePredictionHistoryRequest;

  try {
    const data = await api.deletePredictionHistory(body);
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
| **id** | `number` | Prediction history ID | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Prediction history deleted successfully |  -  |
| **401** | Authentication required |  -  |
| **404** | Prediction history not found |  -  |
| **500** | Unexpected server error |  -  |
| **403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getPredictionHistories

> Array&lt;PredictionHistoryResponse&gt; getPredictionHistories()

Get all prediction history

Returns all saved prediction history records.

### Example

```ts
import {
  Configuration,
  PredictionHistoryApi,
} from '';
import type { GetPredictionHistoriesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PredictionHistoryApi();

  try {
    const data = await api.getPredictionHistories();
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

[**Array&lt;PredictionHistoryResponse&gt;**](PredictionHistoryResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **401** | Authentication required |  -  |
| **500** | Unexpected server error |  -  |
| **403** | Access denied |  -  |
| **200** | Prediction history retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getPredictionHistoryById

> PredictionHistoryResponse getPredictionHistoryById(id)

Get prediction history by ID

Returns one saved prediction history record by prediction ID.

### Example

```ts
import {
  Configuration,
  PredictionHistoryApi,
} from '';
import type { GetPredictionHistoryByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PredictionHistoryApi();

  const body = {
    // number | Prediction history ID
    id: 1,
  } satisfies GetPredictionHistoryByIdRequest;

  try {
    const data = await api.getPredictionHistoryById(body);
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
| **id** | `number` | Prediction history ID | [Defaults to `undefined`] |

### Return type

[**PredictionHistoryResponse**](PredictionHistoryResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Prediction history found |  -  |
| **401** | Authentication required |  -  |
| **404** | Prediction history not found |  -  |
| **500** | Unexpected server error |  -  |
| **403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updatePredictionHistory

> PredictionHistoryResponse updatePredictionHistory(id, predictionResultUpdateRequest)

Update prediction history

Updates an existing saved prediction history record. Requires a valid Bearer JWT.

### Example

```ts
import {
  Configuration,
  PredictionHistoryApi,
} from '';
import type { UpdatePredictionHistoryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PredictionHistoryApi(config);

  const body = {
    // number | Prediction history ID
    id: 1,
    // PredictionResultUpdateRequest
    predictionResultUpdateRequest: ...,
  } satisfies UpdatePredictionHistoryRequest;

  try {
    const data = await api.updatePredictionHistory(body);
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
| **id** | `number` | Prediction history ID | [Defaults to `undefined`] |
| **predictionResultUpdateRequest** | [PredictionResultUpdateRequest](PredictionResultUpdateRequest.md) |  | |

### Return type

[**PredictionHistoryResponse**](PredictionHistoryResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`, `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **401** | Authentication required |  -  |
| **404** | Prediction history not found |  -  |
| **500** | Unexpected server error |  -  |
| **200** | Prediction history updated successfully |  -  |
| **400** | Invalid request or validation failed |  -  |
| **403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

