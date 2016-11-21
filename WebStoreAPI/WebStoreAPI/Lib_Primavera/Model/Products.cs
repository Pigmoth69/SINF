using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebStoreAPI.Lib_Primavera.Model
{
    public class Product
    {
        public string Code
        {
            get;
            set;
        }

        public string Description
        {
            get;
            set;
        }
        public string Family
        {
            get;
            set;
        }
        public string SubFamily
        {
            get;
            set;
        }
        public string Brand
        {
            get;
            set;
        }
        public string Model
        {
            get;
            set;
        }
        public string Currency
        {
            get;
            set;
        }
        public float Discount
        {
            get;
            set;
        }
        public string IVA
        {
            get;
            set;
        }
        public double STKActual
        {
            get;
            set;
        }
        public List<Model.SimpleWarehouse> Warehouses
        {
            get;
            set;
        }
        public int DeliveryTime
        {
            get;
            set;
        }
        public Model.Price Prices
        {
            get;
            set;
        }
        public string Warranty
        {
            get;
            set;
        }

    }
}