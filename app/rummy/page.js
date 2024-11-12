import React, { Suspense } from 'react'
import RummyPage from './RummyPage'

function page() {
  return (
    <Suspense fallback={'Loading'}>
      <RummyPage />
    </Suspense>
  )
}

export default page