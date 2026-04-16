# MatchPredictionApi

All URIs are relative to *https://backend-nexus-capstone.up.railway.app*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**predict**](MatchPredictionApi.md#predict) | **POST** /api/v1/predictions | Predict match outcome |



## predict

> PredictionResponse predict(predictMatchRequest)

Predict match outcome

Predicts the outcome of a boxing match between two fighters.  The system: - Normalizes all attributes using Min-Max normalization - Applies category-based weighting - Calculates each fighter\&#39;s closeness to the Perfect Boxer - Converts closeness into win probabilities - Determines a predicted winner (or draw if equal)  The result includes probabilities, closeness scores, category breakdowns, and an AI-generated explanation. 

### Example

```ts
import {
  Configuration,
  MatchPredictionApi,
} from '';
import type { PredictRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MatchPredictionApi();

  const body = {
    // PredictMatchRequest
    predictMatchRequest: ...,
  } satisfies PredictRequest;

  try {
    const data = await api.predict(body);
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
| **predictMatchRequest** | [PredictMatchRequest](PredictMatchRequest.md) |  | |

### Return type

[**PredictionResponse**](PredictionResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Prediction generated successfully |  -  |
| **400** | Invalid request or validation failed |  -  |
| **403** | Access denied |  -  |
| **404** | Required data not found (e.g., weight class or perfect boxer) |  -  |
| **401** | Authentication required |  -  |
| **500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

