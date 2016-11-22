using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebStoreAPI.Lib_Primavera.Model
{
    public class SimpleProduct
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
        public Model.Price Prices
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
        public double StkActual
        {
            get;
            set;
        }
    }
}
