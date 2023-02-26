using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public interface ImageDto
    {
         string PublicId { get; set; }
         string PictureUrl { get; set; }
    }
}