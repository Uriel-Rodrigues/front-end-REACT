'use client'
//importar hooks do react
import React from "react"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,ResponsiveContainer} from 'recharts';

//definir tipos de dados esperados
interface ProductsAreaChartProps {
    data: {month: string, products:number}[]
} 


const ProductsAreaChart = ({data}: ProductsAreaChartProps) => {

    return(
        <div className="w-full h-96">
            <h2 className="text-base font-semibold text-gray-700 text-center">Produtos cadastrados mensalmente</h2>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{
                        top: 20,
                        right: 0,
                        left: -25,
                        bottom: 25,
                    }}>
                    <CartesianGrid strokeDasharray="0" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="products" stroke="#3182CE" fill="#63B3ED"/>
                </AreaChart>
            </ResponsiveContainer>

        </div>
    )
}
export default ProductsAreaChart