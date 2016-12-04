﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebStoreAPI.Lib_Primavera.Model
{
    public class LinhaDocVenda
    {


        public string CodArtigo
        {
            get;
            set;
        }

         public string DescArtigo
        {
            get;
            set;
        }
         public double TotalDescArtigo
         {
             get;
             set;
         }
         public double TotalDescontoCliente
         {
             get;
             set;
         }
         public double IvaTotal
         {
             get;
             set;
         }
         public string IdCabecDoc
         {
             get;
             set;
         }
         public double Quantidade
        {
            get;
            set;
        }
         public string Unidade
        {
            get;
            set;
        }

         public double Desconto
        {
            get;
            set;
        }

         public double PrecoUnitario
        {
            get;
            set;
        }

         public double TotalILiquido
        {
            get;
            set;
        }

          public double TotalLiquido
        {
            get;
            set;
        }
          public double TotalPrecoArtigo
          {
              get;
              set;
          }

          public String Armazem
          {
              get;
              set;
          }


    }
}