import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Payment from './pages/Payment'
export default function Routing(){
  return(
    <Routes>
      <Route path="/" element={<Homepage/ >}/>
      <Route path="/payment" element={<Payment/ >}/>
    </Routes>
  )
}
