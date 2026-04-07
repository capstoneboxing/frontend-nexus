
# PerfectBoxerGenerationRequest

Request to start perfect boxer generation for a specific weight class

## Properties

Name | Type
------------ | -------------
`weightClassId` | number
`amount` | number

## Example

```typescript
import type { PerfectBoxerGenerationRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "weightClassId": 11,
  "amount": 10,
} satisfies PerfectBoxerGenerationRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PerfectBoxerGenerationRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


