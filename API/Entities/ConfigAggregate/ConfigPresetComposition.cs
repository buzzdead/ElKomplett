using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.ConfigAggregate
{
    public class ConfigPresetComposition
    {
        public int Id { get; set; }
        public string Key { get; set; }
        public List<ConfigPreset> Configurations { get; set; } = new();
        
         public void AddItem(ConfigPreset configPreset) 
        {
           Configurations.Add(configPreset);
        }

        public void RemoveItem(int configPresetId) 
        {
            var configPresetRemove = Configurations.Find(cfgPreset => cfgPreset.Id == configPresetId);
            Configurations.Remove(configPresetRemove);
        }
    }
}