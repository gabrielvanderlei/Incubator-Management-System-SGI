'use client';

import Content from "@/components/template/Content";
import PageListItems from "@/components/template/Page/ListItens";
import { useEffect, useState } from "react";

export default function UsersPage() {
// Ajuste os cabeçalhos para mostrar apenas o e-mail e a função (role)
const headersData = [
  { key: 'email', label: 'E-mail' },
  { key: 'companyId', label: 'ID de Empresa', isCompany: true  },
  { key: 'role', label: 'Função' },
];

  return (
    <>
      <Content headerTitle={'Usuários'}>
        <PageListItems 
            endpoint="/user"  // Substitua pelo seu endpoint real
            headers={headersData}
            createButtonText="Novo"
          />
      </Content>
    </>
  )
}
