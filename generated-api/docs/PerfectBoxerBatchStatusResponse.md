
# PerfectBoxerBatchStatusResponse

Response containing the status of a perfect boxer generation batch

## Properties

Name | Type
------------ | -------------
`batchId` | number
`weightClassId` | number
`amount` | number
`status` | string
`isActive` | boolean
`errorMessage` | string
`createdAt` | Date
`perfectBoxerId` | number

## Example

```typescript
import type { PerfectBoxerBatchStatusResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "batchId": 12,
  "weightClassId": 11,
  "amount": 10,
  "status": COMPLETED,
  "isActive": true,
  "errorMessage": null,
  "createdAt": 2026-03-27T18:30:00Z,
  "perfectBoxerId": 3,
} satisfies PerfectBoxerBatchStatusResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PerfectBoxerBatchStatusResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


