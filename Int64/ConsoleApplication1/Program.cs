using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            Double d = Console.ReadLine() == "max" ? Double.MaxValue : Double.MinValue;
            long l = (long) d;
            Console.WriteLine(l);
            Console.ReadLine();
        }
    }
}
