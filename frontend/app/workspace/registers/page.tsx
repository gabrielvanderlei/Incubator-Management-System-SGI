'use client';

import Content from "@/components/template/Content";
import PageListItems from "@/components/template/Page/ListItens";

export default function RegisterPage() {
  const headersData = [
    { key: 'id', label: 'ID' },
    { key: 'action', label: 'Ação' },
    { key: 'date', label: 'Data' },
    { key: 'userId', label: 'ID do Usuário' },
    { key: 'companyId', label: 'ID de Empresa', isCompany: true  },
  ];
  
  return (
    <>
      <Content headerTitle={'Registros'}>
        <PageListItems 
            endpoint="/log"  // Substitua pelo seu endpoint real
            headers={headersData}
            createButtonText="Novo"
          />
      </Content>
    </>
  )
}
