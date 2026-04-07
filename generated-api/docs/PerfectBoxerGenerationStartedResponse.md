
# PerfectBoxerGenerationStartedResponse

Response returned when perfect boxer generation has started

## Properties

Name | Type
------------ | -------------
`batchId` | number
`weightClassId` | number
`amount` | number
`status` | string
`message` | string

## Example

```typescript
import type { PerfectBoxerGenerationStartedResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "batchId": 12,
  "weightClassId": 11,
  "amount": 10,
  "status": PENDING,
  "message": Perfect boxer generation started,
} satisfies PerfectBoxerGenerationStartedResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PerfectBoxerGenerationStartedResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


