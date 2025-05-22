'use client';

import Content from "@/components/template/Content";
import PageListItems from "@/components/template/Page/ListItens";
import { useEffect, useState } from "react";

export default function DashboardPage() {
// Atualize os cabeçalhos para incluir informações sobre os dashboards e seus indicadores
const headersData = [
  { key: 'id', label: 'ID' },
  { key: 'companyId', label: 'ID da Empresa' },
  { key: 'name', label: 'Nome' },
  { key: 'dashboardData', label: 'Dados', type: 'CSVtoJSON' },
  { key: 'view', label: 'Visualizar', type: 'link', buttonValue: 'Visualizar', href: './dashboards/view', editable: false },
];
  
  let getPermissions = () => {
    if(localStorage.getItem('ROLE') == 'ADMIN'){
      return ['GET', 'EDIT', 'POST', 'DELETE'];
    }
    
    if(localStorage.getItem('ROLE') == 'USER'){
      return ['GET'];
    }
  }

  return (
    <>
      <Content headerTitle={`Paineis`}>
        <PageListItems 
            endpoint="/dashboard"  // Substitua pelo seu endpoint real
            headers={headersData}
            permissions={getPermissions()}
            createButtonText="Novo"
          />
      </Content>
    </>
  )
}
