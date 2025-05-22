'use client';

import Content from "@/components/template/Content";
import PageListItems from "@/components/template/Page/ListItens";
import { useEffect, useState } from "react";

export default function DashboardPage() {

  const headersData = [
    { key: 'id', label: 'ID', type: 'text' },
    { key: 'title', label: 'Título', type: 'text'  },
    { key: 'timestamptz', label: 'Data', type: 'date' },
    { key: 'category', label: 'Categoria', type: 'text' },
    { key: 'description', label: 'Descrição', type: 'text' },
    { key: 'companyId', label: 'ID de Empresa', isCompany: true  },
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
      <Content headerTitle={'Comunicados'}>
        <PageListItems 
            endpoint="/announcement"  // Substitua pelo seu endpoint real
            headers={headersData}
            permissions={getPermissions()}
            createButtonText="Novo"
          />
      </Content>
    </>
  )
}
