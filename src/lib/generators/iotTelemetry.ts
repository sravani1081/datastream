// IoT Sensor & Fleet Telemetry Generator

export interface IoTSensorRecord {
  sensor_id: string;
  facility_id: string;
  machine_type: 'CNC Mill' | 'Turbine' | 'Robotic Arm' | 'Conveyor' | 'Cooling Tower';
  temperature_celsius: number;
  vibration_hz: number;
  pressure_psi: number;
  power_kw: number;
  battery_level_pct: number;
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL_OVERHEAT';
  timestamp: string;
}

export class IoTTelemetryGenerator {
  private static pseudoRandom(seed: number): number {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  static generateReadings(count = 100, seed = 42): IoTSensorRecord[] {
    const machineTypes = ['CNC Mill', 'Turbine', 'Robotic Arm', 'Conveyor', 'Cooling Tower'] as const;

    return Array.from({ length: count }).map((_, i) => {
      const s = seed + i * 23;
      const typeIdx = Math.floor(this.pseudoRandom(s) * machineTypes.length);
      const temp = Number((40 + this.pseudoRandom(s + 1) * 65).toFixed(1));
      const vib = Number((10 + this.pseudoRandom(s + 2) * 90).toFixed(1));
      const press = Number((100 + this.pseudoRandom(s + 3) * 50).toFixed(1));
      const battery = Math.floor(this.pseudoRandom(s + 4) * 100);

      let status: IoTSensorRecord['status'] = 'OPTIMAL';
      if (temp > 85 || vib > 80) status = 'CRITICAL_OVERHEAT';
      else if (temp > 70 || vib > 60) status = 'WARNING';

      return {
        sensor_id: `sns_${100 + (i % 25)}`,
        facility_id: `fac_${(i % 5) + 1}`,
        machine_type: machineTypes[typeIdx],
        temperature_celsius: temp,
        vibration_hz: vib,
        pressure_psi: press,
        power_kw: Number((15 + this.pseudoRandom(s + 5) * 45).toFixed(2)),
        battery_level_pct: battery,
        status,
        timestamp: new Date(Date.now() - i * 15000).toISOString(),
      };
    });
  }
}
