'use client'

import YearlyHeatmap from '../_components/heatmap'
import { useParams } from 'next/navigation'



function Page() {
 const params = useParams();
  const habitId = params.id;
  return (
    <div className='pt-17'>
     
      <YearlyHeatmap habitid={habitId}/>
    </div>
  )
}

export default Page
