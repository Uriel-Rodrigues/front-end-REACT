'use client'
//importar hooks do react
import React from "react"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,ResponsiveContainer} from 'recharts';

//definir os dados esperados
interface UsersBarChartProps {
    data: {month: string, users:number}[]
}

const UsersBarChart = ({data}: UsersBarChartProps) => {
    return(
        <div className="w-full h-96">
            <h2 className="text-base font-semibold text-gray-700 text-center">Usuarios inscritos mensalmente</h2>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{
                        top: 20,
                        right: 0,
                        left: -25,
                        bottom: 25,
                    }}>
                    <CartesianGrid strokeDasharray="0" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="users" fill="#3182CE" barSize={50} />
                </BarChart>
            </ResponsiveContainer>

        </div>
    )
}

export default UsersBarChart