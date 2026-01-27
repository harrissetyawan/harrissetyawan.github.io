import { h, render } from 'https://esm.sh/preact';
import htm from 'https://esm.sh/htm';
import { useState, useEffect, useRef } from 'https://esm.sh/preact/hooks';
import ApexCharts from 'https://cdn.jsdelivr.net/npm/apexcharts/dist/apexcharts.esm.js';

// Initialize htm with Preact
const html = htm.bind(h);

let inputClass = "w-full border border-solid border-gray-300 rounded-2xl px-4 py-2 text-gray-800 leading-relaxed placeholder-gray-400 transition ease-out duration-300 focus:outline-none focus:border-primary z-0 font-normal pac-target-input";

let tableInputClass = "w-16 border border-solid border-gray-300 rounded-2xl px-4 py-2 text-gray-800 leading-relaxed placeholder-gray-400 transition ease-out duration-300 focus:outline-none focus:border-primary z-0 font-normal pac-target-input";

let arrowIcon = html`<svg fill='currentColor' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' height='1rem'><path d='M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z'></path></svg>`
let logoSvg = "https://cdn.prod.website-files.com/678bb0f77140ff853f58938b/681b442ce0d3a58cb606b62b_logo_colour_N1.svg";

function Step0({onNext, setPowerOption, powerOption}) {
  console.log(powerOption);
  const [yes, setYes] = useState(0) // State untuk menyimpan pilihan Yes/No
  let optionClass = "drop-shadow-sm flex flex-col w-[55%] rounded-xl p-2 py-5 border border-gray-300 cursor-pointer hover:bg-black hover:text-white transition-all duration-300 text-center";
  let selectedOptionClass = "bg-black text-white";
  let [selectedOption, setSelectedOption] = useState(null);
  
  return html`
  <div class="h-fit w-full flex gap-5 justify-between border border-gray-150 shadow-sm p-9 rounded-2xl bg-white">
    <div class="w-[50%]">
        <div class="w-full bg-white flex flex-col gap-5">
        <div class="flex flex-col text-center">

        <div class="space-y-2">
          <h1 class="font-bold text-left text-xl tracking-normal">
            Solar Energy for Your Home or Business:
          </h1>
          <p class="text-left text-gray-700 text-lg">
          Want to find out how much you could save with a Yallagreen solar + battery storage system? Simply select Off-Grid or On-Grid to get started. For precise figures, one of our certified specialist engineers will arrange a site visit.
          </p>
        </div>
        <div class="mt-5">
          <p class="mb-2 text-gray-600 text-xl font-semibold text-left">Do you already have PV System?</p>
          <div class="grid grid-flow-col grid-cols-2">
            <button 
              type="button" 
              class="${yes === 1 ? 'bg-gray-900 text-white' : 'bg-slate-100 text-inherit'} py-2.5 px-6 inline rounded-3xl"
              onClick=${() => setYes(1)}
            >Yes</button>
            <button 
              type="button" 
              class="${yes === 0 ? 'bg-gray-900 text-white' : 'bg-slate-100 text-inherit'} py-2.5 px-6 inline rounded-3xl"
              onClick=${() => setYes(0)}
            >No</button>
          </div>
        </div>
        <div class="text-gray-600 text-xl font-semibold text-left mt-8">Choose your ideal solution?</div>
        </div>

        <div class="flex gap-6 justify-center content-center items-center" id="power-option">
          <div 
            class="${optionClass} ${selectedOption === 'offgrid' ? selectedOptionClass : 'bg-gray-50/100'}"
            onClick=${() => {
              setSelectedOption('offgrid');
              setPowerOption("offgrid");
              // onNext(0);
            }}>
            <div class="text-2xl font-bold">Off Grid</div>
            <p class="text-gray-500 text-md">Fully on gen power</p>
          </div>
          <div 
            class="${optionClass} ${selectedOption === 'ongrid' ? selectedOptionClass : 'bg-gray-50/100'}"
            onClick=${() => {
              setSelectedOption('ongrid');
              setPowerOption("ongrid");
              // onNext(1);
            }}>
            <div class="text-2xl font-bold">On Grid</div>
            <p class="text-gray-500 text-md">Fully on electricity power</p>
          </div>
        </div>
      </div>
    </div>
    <div class="w-[50%] flex flex-col gap-5 justify-between">
      <img class="rounded-lg" src="https://cdn.prod.website-files.com/678bb0f77140ff853f58938b/681b6132a130ad8666176920_bird39s-eye-view-solar-panels-coastal-building-with-ocean-background-sky-text.webp" />
      <div class="w-full bg-white flex flex-col gap-5  ${powerOption === null ? "hidden" : ""}">
        <button class="self-end inline-flex items-center gap-2 drop-shadow-md bg-primary text-white px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 transition-all duration-300" id="next-button" onClick=${() => onNext(powerOption === "offgrid" ? 0 : 1)}>Results ${arrowIcon}</button>
      </div>
    </div>
  </div>
  `
}

function Step1({ usagePerDay, setUsagePerDay, inflationGas, onNext, onPrev, marketPriceGas, setMarketPriceGas }) {
  return html`
    <button
      class="transition-all duration-300 rotate-180"
      onClick=${()=>onPrev(1)}
    >${arrowIcon}</button>
    <div class="h-fit w-full flex gap-5 justify-between border border-gray-150 shadow-sm p-9 rounded-2xl bg-white">
      <div class="w-1/2 bg-white flex flex-col gap-5">
        <div class="">
          <div class="text-gray-900 text-4xl font-bold">Off Grid</div>
          <p class="text-gray-500 text-2xl">Fully on gen power</p>
        </div>

        <div class="flex">
          <p class="text-gray-500 text-xl">From gasoline to electricity is <b>8,9</b> without losses and between <b>3</b> and <b>5</b> with losses, We calculatie with <b>3.6</b></p>
        </div>

        <div>
          <div class="input-wrapper flex flex-row gap-2 justify-between">
            <label for="input-field ">Electricity consumption per day</label>
            <div class="self-end text-right text-xl text-gray-600 font-bold">
              ${usagePerDay * 3.6}
            </div>
          </div>
          <div class="input-wrapper hidden flex flex-row gap-2 justify-between">
            <label for="input-field ">Inflation on gasoline</label>
            <div class="self-end text-right text-xl text-gray-600 font-bold">
              ${inflationGas * 100}%
            </div>
          </div>
        </div>
      </div>
      <!-- Inputs -->
      <div class="bg-white w-1/2 flex flex-col gap-5">
        <div class="flex flex-col gap-5">

          <div class="input-wrapper flex flex-col gap-2">
            <label for="input-field ">Usage per day in <b>liters</b></label>
            <input 
              type="number" 
              id="usage-per-day" 
              class="${inputClass}" 
              oninput=${(e) => setUsagePerDay(e.target.value)}
              value=${usagePerDay}
              placeholder="250"
            />
          </div>

          <div class="input-wrapper flex flex-col gap-2">
            <label for="input-field ">Market price per liter gasoline</label>
            <input type="number" class="${inputClass}" oninput=${(e) => {setMarketPriceGas(e.target.value);console.log(marketPriceGas)}} value=${marketPriceGas} placeholder="1,2" />
          </div>

          <button class="self-end inline-flex items-center gap-2 drop-shadow-md bg-primary text-white px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 transition-all duration-300" id="next-button" onClick=${() => onNext(2)}>Results ${arrowIcon}</button>

        </div>
      </div>
    </div>
    `;
} 

function Step2({ usagePerDay, setUsagePerDay, inflationGas, onPrev, onNext, marketPriceKwh, setMarketPriceKwh }) {
  const inflationElectricity = 0.05; // 5%
  return html`
    <button
      class="transition-all duration-300 rotate-180"
      onClick=${() => onPrev(1)}
    >${arrowIcon}</button>
    <div class="h-fit w-full flex gap-5 justify-between border border-gray-150 shadow-sm p-9 rounded-2xl bg-white">
      <div class="w-1/2 bg-white flex flex-col gap-5 justify-between">
        <div class="">
          <div class="text-gray-900 text-4xl font-bold">On Grid</div>
          <p class="text-gray-500 text-2xl">Fully on electricity power</p>
        </div>
        <div>
          <div class="input-wrapper flex flex-row gap-2 justify-between">
            <label for="input-field ">Inflation on Genpower</label>
            <div class="self-end text-right text-xl text-gray-600 font-bold">
              ${inflationGas * 100}%
            </div>
          </div>
        </div>

      </div>
      <!-- Inputs -->
      <div class="bg-white w-1/2 flex flex-col gap-5">
        <div class="flex flex-col gap-5">

          <div class="input-wrapper flex flex-col gap-2">
            <label for="input-field ">Electricity consumption per day</label>
            <input 
              type="number" 
              id="usage-per-day" 
              class="${inputClass}" 
              oninput=${(e) => setUsagePerDay(e.target.value)}
              value=${usagePerDay}
              placeholder="250" />
          </div>

          <div class="input-wrapper flex flex-col gap-2">
            <label for="input-field ">Market price per <b>kWh</b></label>
            <input type="number" class="${inputClass}" oninput=${(e) => setMarketPriceKwh(e.target.value)} placeholder="0,18" value=${marketPriceKwh} />
          </div>

            <button class="self-end inline-flex items-center gap-2 drop-shadow-md bg-primary text-white px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 transition-all duration-300" id="next-button" onClick=${() => onNext(2)}>Results ${arrowIcon}</button>

        </div>
      </div>
    </div>
  `;
}

function Step3({ usagePerDay, setUsagePerDay, inflationGas, marketPriceGas, marketPriceKwh, setMarketPriceKwh, powerOption, onNext, onPrev }) {

  let [subsidy, setSubsidy] = useState(0.3);

  let interestTable = [
    {
      rate: "3%",
      "6years": 0.191,
      "7years": 0.167,
      "8years": 0.149
    },
    {
      rate: "4%",
      "6years": 0.199,
      "7years": 0.175,
      "8years": 0.157
    },
    {
      rate: "5%",
      "6years": 0.207,
      "7years": 0.183,
      "8years": 0.165
    },
    {
      rate: "6%",
      "6years": 0.215,
      "7years": 0.191,
      "8years": 0.173
    },
    {
      rate: "7%",
      "6years": 0.224,
      "7years": 0.200,
      "8years": 0.181
    }
  ]
  let [firstPayment, setFirstPayment] = useState(0.1);
  let [lastPayment, setLastPayment] = useState(0.15);
  let [interestRate, setInterestRate] = useState(interestTable[2].rate);
  let selectedInterest = interestTable.find(opt => opt.rate == interestRate);
  let [yearsOfLoan, setYearsOfLoan] = useState("6years");
  let interest = selectedInterest[yearsOfLoan];

  // Menghitung nilai-nilai dasar
  const dailyKwhPanels = powerOption === "offgrid" ? usagePerDay * 3.6 : usagePerDay;
  const dailyKwhBattery = dailyKwhPanels * 0.45;
  const panelCost = dailyKwhPanels * 162.1555;
  const batteryCost = dailyKwhBattery * 431;
  const totalInvestment = panelCost + batteryCost;
  const subsidyAmount = totalInvestment * subsidy;
  const nettoInvestment = totalInvestment - subsidyAmount;
  
  // Menghitung pembayaran
  const firstPaymentAmount = firstPayment * nettoInvestment;
  const lastPaymentAmount = lastPayment * nettoInvestment;
  const totalFinancialLease = nettoInvestment - firstPaymentAmount - lastPaymentAmount;
  
  // Menghitung biaya tahunan
  const yearlyFinancialLease = totalFinancialLease * interest;
  const yearlyMaintenance = totalInvestment * 0.008;
  const yearlyInsurance = totalInvestment * 0.005;
  const totalYearlyCosts = yearlyFinancialLease + yearlyMaintenance + yearlyInsurance;
  const monthlyPayment = totalYearlyCosts / 12;
  
  // Menghitung biaya bulanan bensin
  const monthlyGasCost = usagePerDay * marketPriceGas * 365/12;
  
  // Menghitung biaya bulanan listrik grid
  const monthlyGridCost = usagePerDay * marketPriceKwh * 365/12;

  globalThis.monthlyGridCost = monthlyGridCost;
  globalThis.monthlyGasCost = monthlyGasCost;
  globalThis.monthlyPayment = monthlyPayment;
  globalThis.monthlyYearlyCosts = totalYearlyCosts;
  globalThis.monthlySubsidy = subsidyAmount;
  globalThis.monthlyNettoInvestment = nettoInvestment;
  globalThis.monthlyFinancialLease = totalFinancialLease;
  globalThis.monthlyInsurance = yearlyInsurance;
  globalThis.monthlyMaintenance = yearlyMaintenance;
  
  return html`
  <button
    class="transition-all duration-300 rotate-180"
    onClick=${() => { 
      console.log(powerOption);
      powerOption === "offgrid" ? onPrev(2) : onPrev(3); 
    }}
  >${arrowIcon}</button>
    <div class="h-fit w-full flex gap-5 justify-between border border-gray-150 shadow-sm p-9 rounded-2xl bg-white">
    <${powerOption === "offgrid" ? offGrid : onGrid}
        monthlyGasCost=${monthlyGasCost}
        dailyKwhPanels=${dailyKwhPanels}
        usagePerDay=${usagePerDay}
        dailyKwhBattery=${dailyKwhBattery}
        panelCost=${panelCost}
        batteryCost=${batteryCost}
        totalInvestment=${totalInvestment}
        subsidy=${subsidy}
        setSubsidy=${setSubsidy}
        subsidyAmount=${subsidyAmount}
        interestRate=${interestRate}
        setInterestRate=${setInterestRate}
        interestTable=${interestTable}
        yearsOfLoan=${yearsOfLoan}
        setYearsOfLoan=${setYearsOfLoan}
        interest=${interest}
        firstPayment=${firstPayment}
        setFirstPayment=${setFirstPayment}
        firstPaymentAmount=${firstPaymentAmount}
        selectedInterest=${selectedInterest}
        lastPayment=${lastPayment}
        setLastPayment=${setLastPayment}
        lastPaymentAmount=${lastPaymentAmount}
        totalFinancialLease=${totalFinancialLease}
        yearlyFinancialLease=${yearlyFinancialLease}
        yearlyMaintenance=${yearlyMaintenance}
        yearlyInsurance=${yearlyInsurance}
        totalYearlyCosts=${totalYearlyCosts}
        monthlyPayment=${monthlyPayment}
        nettoInvestment=${nettoInvestment}
      />
    </div>
    <div class="flex justify-end mt-4">
    <button class="self-end inline-flex items-center gap-2 drop-shadow-md bg-primary text-white px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 transition-all duration-300" id="next-button" onClick=${() => onNext(3)}>Next ${arrowIcon}</button>
    </div>
  `
}

function Step4({ usagePerDay, setUsagePerDay, inflationGas, marketPriceGas, marketPriceKwh, setMarketPriceKwh, onNext, onPrev, powerOption }) {

  const gasolineValues = (() => {
    const arr = Array(10).fill(globalThis.monthlyGasCost);
    arr[0] = Math.round(globalThis.monthlyGasCost * 12);
    for (let i = 1; i < 10; i++) {
      arr[i] = arr[i-1] * 1.05;
    }
    return arr;
  })();

  const yGreenGasolineValues = (() => {
    const arr = Array(10).fill(globalThis.monthlyPayment);
    arr[0] = Math.round(globalThis.monthlyPayment * 12);
    for (let i = 1; i < 6; i++) {
      arr[i] = arr[0];
    }
    return arr;
  })();

  const gasolineSavingsPercent = gasolineValues.map((gas, i) => {
    const yGreen = yGreenGasolineValues[i] ?? 0;
    return ((gas - yGreen) / gas * 100).toFixed(2);
  });

  const gasolineSavingsEuro = gasolineValues.map((gas, i) => {
    const yGreen = yGreenGasolineValues[i] ?? 0;
    return (gas - yGreen).toFixed(2);
  });
  
  const gridCostValues = (() => {
    const arr = Array(10).fill(globalThis.monthlyGridCost);
    arr[0] = Math.round(globalThis.monthlyGridCost * 12).toFixed(2);
    for (let i = 1; i < 10; i++) {
      arr[i] = arr[i-1] * 1.05;
    }
    return arr;
  })();
  
  const yGreenGridValues = (() => {
    const arr = Array(10).fill(globalThis.monthlyPayment);
    arr[0] = Math.round(globalThis.monthlyPayment * 12).toFixed(2);
    for (let i = 1; i < 6; i++) {
      arr[i] = arr[0];
    }
    return arr;
  })();

  const gridSavingsPercent = gridCostValues.map((grid, i) => {
    const yGreen = yGreenGridValues[i] ?? 0;
    return ((grid - yGreen) / grid * 100).toFixed(2);
  });
  
  const gridSavingsDH = gridCostValues.map((grid, i) => {
    const yGreen = yGreenGridValues[i] ?? 0;
    return (grid - yGreen).toFixed(2);
  });

  const yearlyData = {
    gasoline: {
      label: "Based upon Gasoline",
      values: gasolineValues
    },
    yGreenGasoline: {
      label: "Y-Green Gasoline",
      values: yGreenGasolineValues
    },
    gasolineSavingsPercent: {
      label: "Savings in %",
      values: gasolineSavingsPercent
    },
    gasolineSavingsEuro: {
      label: "Savings in euro",
      values: gasolineSavingsEuro
    },
    grid: {
      label: "Based upon Electricity from the grid",
      values: gridCostValues
    },
    yGreenGrid: {
      label: "Y-Green Electricity",
      values: yGreenGridValues
    },
    gridSavingsPercent: {
      label: "Savings in %",
      values: gridSavingsPercent
    },
    gridSavingsDH: {
      label: "Savings in Euro",
      values: gridSavingsDH
    }
  };

  const chartGasRef = useRef(null);
  const chartGridRef = useRef(null);

  useEffect(() => {
    let chartGas = null;
    if (chartGasRef.current) {
      var options = {
        chart: {
          height: 335, type: "area"
        },
        dataLabels: { enabled: false },
        series: [
          { name: yearlyData.gasoline.label, data: yearlyData.gasoline.values },
          { name: yearlyData.yGreenGasoline.label, data: yearlyData.yGreenGasoline.values },
          // { name: yearlyData.gasolineSavingsPercent.label, data: yearlyData.gasolineSavingsPercent.values },
          // { name: yearlyData.gasolineSavingsEuro.label, data: yearlyData.gasolineSavingsEuro.values }
        ],
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100]
          }
        },
        xaxis: {
          categories: [
            "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10"
          ]
        },
        yaxis: {
          labels: {
            formatter: function(value) {
              return '€ ' + Number(value).toLocaleString('id-ID', { maximumFractionDigits: 2 });
            }
          }
        },
        tooltip: {
          y: {
            formatter: function(value) {
              return '€ ' + Number(value).toLocaleString('id-ID', { maximumFractionDigits: 2 });
            }
          }
        }
      };
      chartGas = new ApexCharts(document.querySelector("#chart-comparison-gas"), options);
      chartGas.render();
    }

    let chartGrid = null;
    if(chartGridRef.current) {
      var options = {
        chart: {
          height: 380,
          type: "area"
        },
        dataLabels: {
          enabled: false
        },
        series: [
          {
            name: yearlyData.grid.label,
            data: yearlyData.grid.values
          },
          {
            name: yearlyData.yGreenGrid.label,
            data: yearlyData.yGreenGrid.values
          },
          // {
          //   name: yearlyData.gridSavingsPercent.label,
          //   data: yearlyData.gridSavingsPercent.values
          // },
          // {
          //   name: yearlyData.gridSavingsDH.label,
          //   data: yearlyData.gridSavingsDH.values
          // }
        ],
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100]
          }
        },
        xaxis: {
          categories: [
            "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10"
          ]
        },
        yaxis: {
          labels: {
            formatter: function(value) {
              return '€ ' + Number(value).toLocaleString('id-ID', { maximumFractionDigits: 2 });
            }
          }
        },
        tooltip: {
          y: {
            formatter: function(value) {
              return '€ ' + Number(value).toLocaleString('id-ID', { maximumFractionDigits: 2 });
            }
          }
        }
      };

      chartGrid = new ApexCharts(document.querySelector("#chart-comparison-grid"), options);
      chartGrid.render();      
    }
      return () => {
        if (chartGas) chartGas.destroy();
        if (chartGrid) chartGrid.destroy();
      }
  }, []);

  return html`
  <button
    class="transition-all duration-300 rotate-180"
    onClick=${() => {
      onPrev(4);
    }}>
    ${arrowIcon}
  </button>
  <div class="flex flex-col gap-5 border border-gray-150 shadow-sm p-4 px-4 rounded-2xl bg-white">
    <div class="w-full flex flex-col justify-center">
      <div class="text-center text-gray-800 text-2xl font-semibold">Monthly</div>
      <span class="text-center text-gray-500">All prices in Euros</span>
    </div>

    <div class="h-fit w-full flex gap-5 justify-center">
      ${(() => {
        if(powerOption === "offgrid") {
          return html`
          <div class="w-1/2 bg-white flex flex-col gap-1 border border-gray-150 shadow-sm p-4 px-4 rounded-2xl">
            <div class="text-left flex-1 text-xl text-gray-500 font-semibold mb-2">
              Based upon gasoline
            </div>
            <div class="border-t border-gray-150"></div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 font-semibold text-gray-700">Gasoline</div>
              <div class="text-right flex-1">
              <span class="text-gray-500 text-normal font-semibold">€</span> ${Math.round(globalThis.monthlyGasCost).toLocaleString('id-ID')}</div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 font-semibold text-gray-700">Y-Green cost</div>
              <div class="text-right flex-1">
              <span class="text-gray-500 text-normal font-semibold">€</span> ${Math.round(globalThis.monthlyPayment).toLocaleString('id-ID')}</div>
            </div>
            <div class="flex justify-between items-center mt-4">
              <div class="text-left flex-1 font-semibold text-gray-700">Savings in %</div>
              <div class="text-right flex-1">${(Math.round((globalThis.monthlyGasCost - globalThis.monthlyPayment) / globalThis.monthlyGasCost * 100)).toFixed(0)}%</div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 font-semibold text-gray-700">Savings in Euro</div>
              <div class="text-right flex-1">
              <span class="text-gray-500 text-normal font-semibold">€</span> ${Math.round(globalThis.monthlyGasCost - globalThis.monthlyPayment).toLocaleString('id-ID')}
              </div>
            </div>
          </div> <!-- end of based upon gasoline -->` 
        } else {
          return html`
          <div class="w-1/2 bg-white flex flex-col gap-1 border border-gray-150 shadow-sm p-4 px-4 rounded-2xl">
          <div class="text-left flex-1 text-xl text-gray-500 font-semibold mb-2">Based upon electricity from the grid</div>
          <div class="border-t border-gray-150"></div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 font-semibold text-gray-700">Grid costs</div>
            <div class="text-right flex-1">
            <span class="text-gray-500 text-normal font-semibold">€</span> ${Math.round(globalThis.monthlyGridCost).toLocaleString('id-ID')}</div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 font-semibold text-gray-700">Y-Green cost</div>
            <div class="text-right flex-1">
            <span class="text-gray-500 text-normal font-semibold">€</span> ${Math.round(globalThis.monthlyPayment).toLocaleString('id-ID')}</div>
          </div>
          <div class="flex justify-between items-center mt-4">
            <div class="text-left flex-1 font-semibold text-gray-700">Savings in %</div>
            <div class="text-right flex-1">${Math.round((globalThis.monthlyGridCost - globalThis.monthlyPayment) / globalThis.monthlyGridCost * 100).toFixed(0)}%</div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 font-semibold text-gray-700">Savings in Euro</div>
            <div class="text-right flex-1">
            <span class="text-gray-500 text-normal font-semibold">€</span> ${Math.round((globalThis.monthlyGridCost - globalThis.monthlyPayment)).toLocaleString('id-ID')}</div>
          </div>
  
        </div> <!-- end of based upon electricity from the grid -->
        `
        }
      })()}
    </div>
    
    <div id="chart-container" class="w-full h-full flex gap-4 justify-center items-center mt-5 p-6 rounded-2xl">
      ${(() => {
        if(powerOption === "offgrid") {
          return html`
            <div class="flex justify-center h-full w-[60%] p-5 border bg-gray-100 border-gray-150 shadow-sm rounded-2xl gap-8 sm:gap-32">
              <section class="flex flex-col items-center w-1/2 sm:w-auto">
                <div class="relative bg-gray-300 rounded-3xl w-10 h-[350px]">
                  <div class="absolute bottom-0 left-0 w-full" style="height: 100%; background-color: rgb(0, 64, 250); border-radius: 24px;">
                  </div>
                </div>
                <div class="text-center mt-4">
                  <p class="text-sm sm:text-base font-bold md:text-[20px]">
                  <span class="text-gray-500 text-normal font-semibold">€</span> ${Math.round(globalThis.monthlyGasCost).toLocaleString('id-ID')}</p>
                  <p class="text-xs sm:text-sm text-[#565E73] font-semibold">Gasoline</p>
                </div>
              </section>
              <section class="flex flex-col items-center w-1/2 sm:w-auto">
                <div class="relative bg-gray-300 rounded-3xl w-10 h-[350px]">
                  <div class="absolute bottom-0 left-0 w-full" style="height: ${(globalThis.monthlyPayment/globalThis.monthlyGasCost * 100)}%; background-color: rgb(0, 64, 250); border-radius: 24px;"></div>
                </div>
                <div class="text-center mt-4">
                  <p class="text-sm sm:text-base font-bold md:text-[20px]">
                  <span class="text-gray-500 text-normal font-semibold">€</span> ${Math.round(globalThis.monthlyPayment).toLocaleString('id-ID')}</p>
                  <p class="text-xs sm:text-sm text-[#565E73] font-semibold">Y-Green cost</p>
                </div>
              </section>
            </div>
            <div id="chart-comparison-gas" ref=${chartGasRef} class="w-[80%] h-full p-9 bg-gray-100 rounded-2xl shadow-sm">
              <div class="text-left text-gray-800 text-3xl font-semibold mb-2">
              Based upon Gasoline
              </div>
            </div>
          `;
        } else {
          return html`
            <div class="flex justify-center h-full w-[60%] p-5 border bg-gray-100 border-gray-150 shadow-sm rounded-2xl gap-8 sm:gap-32">
              <section class="flex flex-col items-center w-1/2 sm:w-auto">
                <div class="relative bg-gray-300 rounded-3xl w-10 h-[395px]">
                  <div class="absolute bottom-0 left-0 w-full" style="height: 100%; background-color: rgb(0, 64, 250); border-radius: 24px;">
                  </div>
                </div>
                <div class="text-center mt-4">
                  <p class="text-sm sm:text-base font-bold md:text-[20px]">
                  <span class="text-gray-500 text-normal font-semibold">€</span> ${Math.round(globalThis.monthlyGridCost ?? "00").toLocaleString('id-ID')}</p>
                  <p class="text-xs sm:text-sm text-[#565E73] font-semibold">Grid Costs</p>
                </div>
              </section>
              <section class="flex flex-col items-center w-1/2 sm:w-auto">
                <div class="relative bg-gray-300 rounded-3xl w-10 h-[395px]">
                  <div class="absolute bottom-0 left-0 w-full" style="height: ${(globalThis.monthlyPayment/globalThis.monthlyGasCost * 120)}%; background-color: rgb(0, 64, 250); border-radius: 24px;"></div>
                </div>
                <div class="text-center mt-4">
                  <p class="text-sm sm:text-base font-bold md:text-[20px]">
                  <span class="text-gray-500 text-normal font-semibold">€</span> ${Math.round(globalThis.monthlyPayment ?? "00").toLocaleString('id-ID')}</p>
                  <p class="text-xs sm:text-sm text-[#565E73] font-semibold">Y-Green cost</p>
                </div>
              </section>
            </div>
            <div class="w-[80%] h-full p-9 bg-gray-100 rounded-2xl shadow-sm">
              <div class="text-left text-gray-800 text-3xl font-semibold mb-2">Based upon Electricity from the grid</div>
              <div id="chart-comparison-grid" ref=${chartGridRef}></div>
            </div>
          `;
        }
      })()}
    </div>

    <div id="chart-container-x" class="w-full h-full flex flex-col gap-4 justify-center items-center mt-5 p-6 rounded-2xl">
      <div class="flex flex-col items-center">
        <div class="flex justify-center items-center -space-x-10">
          <div 
            class="rounded-full transition-size duration-500 flex justify-center items-center text-white" 
            style="width: 115.58px; height: 115.58px; background-color: rgb(251, 120, 53); z-index: 10;">
          </div>
          <div 
            class="rounded-full transition-size duration-500 flex justify-center items-center text-white" 
            style="width: 284.42px; height: 284.42px; background-color: rgb(0, 64, 250); z-index: 0;">
          </div>
        </div>
        <div class="flex justify-center items-center space-x-10 mt-4 w-full gap-4">
          <div class="text-center flex flex-col">
            <div>
              <span class="text-[30px] font-medium">431</span>
              <span class="font-bold text-gray-500">kWh</span>
            </div>
            <span>Daily need KWh Battery capacity</span>
          </div>
          <div class="text-center flex flex-col">
            <div>
              <span class="text-[30px] font-medium">162,15</span>
              <span class="font-bold text-gray-500">kWh</span>
            </div>
            <span>Daily need KWh EV panels</span>
          </div>
        </div>
      </div> <!-- end of blue circle -->

      <${Form} />
    </div>

  </div>
  `;
}

function Form(){
  return html`
  
  <div class="w-[80%] flex flex-col gap-5 border border-gray-150 shadow-sm p-4 px-4 rounded-2xl bg-white">
    <div class="w-full flex flex-col justify-center">
      <form class="flex flex-col gap-2">
        <div class="flex gap-2">
          <div class="flex flex-col gap-2 w-full">
            <label for="name" class="text-gray-700 font-semibold text-sm leading-tight">First Name</label>
            <input type="text" class="${inputClass}" id="name" name="name" />
          </div>              
          <div class="flex flex-col gap-2 w-full">
            <label for="name" class="text-gray-700 font-semibold text-sm leading-tight">Last Name</label>
            <input type="text" class="${inputClass}" id="name" name="name" />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label for="name" class="text-gray-700 font-semibold text-sm leading-tight">Phone Number</label>
          <input type="tel" class="${inputClass}" id="name" name="name" />
        </div>

        <div class="flex flex-col gap-2">
          <label for="name" class="text-gray-700 font-semibold text-sm leading-tight">Email</label>
          <input type="email" class="${inputClass}" id="name" name="name" />
        </div>

        <div class="flex flex-col gap-2">
          <button class="self-end inline-flex items-center gap-2 drop-shadow-md bg-primary text-white px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 transition-all duration-300" id="next-button" type="submit">Send ${arrowIcon}</button>
        </div>

      </form>
    </div>
  </div>
  `
}

function offGrid(props){
  const {
    monthlyGasCost, dailyKwhPanels, dailyKwhBattery, panelCost, batteryCost, totalInvestment, selectedInterest, subsidy, setSubsidy, subsidyAmount, interestRate, setInterestRate, interestTable, yearsOfLoan, setYearsOfLoan, interest, firstPayment, setFirstPayment, firstPaymentAmount, lastPayment, setLastPayment, lastPaymentAmount, totalFinancialLease, yearlyFinancialLease, yearlyMaintenance, yearlyInsurance, totalYearlyCosts, monthlyPayment, nettoInvestment
  } = props;

  return html`
    <div class="flex flex-col justify-center items-center w-full">
        <div class="Off Grid w-[65%] border border-gray-150 shadow-sm p-4 px-4 rounded-2xl bg-white">
          <div class="flex justify-between items-center">
            <div class="text-gray-500 text-lg">Off Grid</div>
            <div class="text-gray-500 text-lg">YallaGreen Investment</div>
          </div>
          <div class="text-gray-900 text-3xl flex justify-between">
            <div class="flex font-bold flex-end gap-1">
              <span class="text-gray-500 text-lg self-end">€ </span>
              <span class="text-gray-900 text-3xl self-end leading-[0.9em]">${Math.round(monthlyGasCost).toLocaleString('id-ID')}</span>
              <span class="text-gray-500 text-sm font-normal self-end">/month</span>
            </div>
            <div class="flex font-bold flex-end gap-1">
              <span class="text-gray-500 text-lg self-end">€ </span>
              <span class="text-gray-900 text-3xl self-end leading-[0.9em]">${Math.round(monthlyPayment).toLocaleString('id-ID')}</span>
              <span class="text-gray-500 text-sm font-normal self-end">/month</span>
            </div>
            </div>
            <div class="disclaimer-container border border-gray-150 rounded-2xl p-2 text-[0.7em] mt-3 text-gray-500 font-normal">
            Disclaimer: The figures presented on this website are based on general assumptions and are intended for illustrative purposes only. Actual results may vary depending on individual circumstances and country-specific regulations. Please consult with our team for information tailored to your situation.
            </div>

          <div class="border-t border-gray-150 my-5"></div>

          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 font-semibold">Assumptions
              </div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 font-semibold">Price EV panels per KWh</div>
              <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal">€ </span>162,15</div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 font-semibold">Price Battery per KWh</div>
              <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal">€ </span>431</div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600">Daily need KWh EV panels</div>
              <div class="text-right flex-1 font-semibold">${Math.round(dailyKwhPanels)}</div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600">Daily need KWh battery capacity</div>
              <div class="text-right flex-1 font-semibold">${Math.round(dailyKwhBattery)}</div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600">Installation costs</div>
              <div class="text-right flex-1 font-semibold">Included</div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600">Tranport, software, extra coverage</div>
              <div class="text-right flex-1 font-semibold">Included</div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600">Subsidy</div>
              <div class="text-right flex-1 font-semibold flex justify-end items-center">
                <input 
                  type="number" 
                  disabled
                  class="${tableInputClass} w-[40%]" 
                  placeholder="0" 
                  oninput=${(e) => setSubsidy(Number(e.target.value) / 100)}
                  value=${subsidy * 100}
                />
                <span class="ml-1">%</span>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600">Interest rate</div>
              <div class="text-right flex-1 font-semibold flex justify-end items-center">
                <select
                  class="${tableInputClass} w-[40%]"
                  value=${interestRate}
                  disabled
                  id="rate-int"
                  onChange=${e => setInterestRate(e.target.value)}
                >
                  ${interestTable.map(opt => html`
                    <option value=${opt.rate}>${opt.rate}</option>
                  `)}
                </select>
                <span class="ml-1 invisible">%</span>
              </div>
            </div>
            
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600">Years of Loan</div>
              <div class="text-right flex-1 font-semibold flex justify-end items-center">
                <select
                  class="${tableInputClass} w-[40%]"
                  id="years-int"
                  disabled
                  value=${yearsOfLoan}
                  onChange=${e => setYearsOfLoan(e.target.value)}
                >
                ${Object.entries(selectedInterest)
                  .filter(([key]) => key !== "rate")
                  .map(([key, value]) => html`
                      <option value=${key} data-rate=${value}>
                        ${key.replace("years", " Years")}
                      </option>
                  `)
                }
                </select>
                <span class="ml-1 invisible">%</span>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600">Interest</div>
              <div class="text-right flex-1 font-semibold">${(interest * 100).toFixed(2)}%</div>
            </div>

          </div>

          <div class="flex flex-col gap-2 pt-5">
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 font-semibold">Investment Costs</div>
              <div class="text-right flex-1"></div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600">Solar Panels</div>
              <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal">€ </span>
                ${Math.round(panelCost).toLocaleString('id-ID')}
              </div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600">Battery</div>
              <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal">€ </span>
                ${Math.round(batteryCost).toLocaleString('id-ID')}
              </div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600 font-bold">Total investment</div>
              <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal">€ </span>
                ${Math.round(totalInvestment).toLocaleString('id-ID')}
              </div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600">Subsidy</div>
              <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal">€ </span>
                ${Math.round(subsidyAmount).toLocaleString('id-ID')}
              </div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600 font-bold">Total netto investment</div>
              <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal">€ </span>
                ${Math.round(nettoInvestment).toLocaleString('id-ID')}
              </div>
            </div>
            <div class="text-left flex-1 font-semibold">Investment</div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600">First payment</div>
              <div class="text-left flex-1 font-semibold flex justify-end items-center">
                <input 
                  type="number" 
                  class="${tableInputClass} w-[35%]" 
                  placeholder="0" 
                  disabled
                  oninput=${(e) => setFirstPayment(Number(e.target.value / 100))}
                  value=${firstPayment * 100}
                />
                <span class="ml-1">%</span>
                <div class="text-right flex-1 font-semibold">
                <span class="text-gray-500 text-normal">€ </span>
                  ${Math.round(firstPaymentAmount).toLocaleString('id-ID')}
                </div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600">Last payment</div>
              <div class="text-left flex-1 font-semibold flex justify-end items-center">
                <input 
                  type="number" 
                  class="${tableInputClass} w-[35%]" 
                  placeholder="0" 
                  disabled
                  oninput=${(e) => setLastPayment(Number(e.target.value / 100))}
                  value=${lastPayment * 100}
                />
                <span class="ml-1">%</span>
                <div class="text-right flex-1 font-semibold">
                <span class="text-gray-500 text-normal">€ </span>
                  ${Math.round(lastPaymentAmount).toLocaleString('id-ID')}
                </div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600 font-bold">Total financial lease</div>
              <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal">€ </span>
                ${Math.round(totalFinancialLease).toLocaleString('id-ID')}
              </div>
            </div>

            <div class="text-left flex-1 font-semibold">Yearly costs</div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600">Financial lease</div>
              <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal">€ </span>
                ${Math.round(yearlyFinancialLease).toLocaleString('id-ID')}
              </div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600">Maintenance & software</div>
              <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal">€ </span>
                ${Math.round(yearlyMaintenance).toLocaleString('id-ID')}
              </div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600">Insurance</div>
              <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal">€ </span>
                ${Math.round(yearlyInsurance).toLocaleString('id-ID')}
              </div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600 font-bold">Total yearly costs</div>
              <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal">€ </span>
                ${Math.round(totalYearlyCosts).toLocaleString('id-ID')}
              </div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-left flex-1 leading-tight text-gray-600 font-bold">Total monthly costs</div>
              <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal">€ </span>
                ${Math.round(monthlyPayment).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div> <!-- end of off grid -->
  </div>`
}

function onGrid(props) {
  const {
    monthlyGasCost, dailyKwhPanels, usagePerDay, dailyKwhBattery, panelCost, batteryCost, totalInvestment,
    subsidy, setSubsidy, subsidyAmount, interestRate, setInterestRate, interestTable,
    yearsOfLoan, setYearsOfLoan, interest, firstPayment, setFirstPayment, firstPaymentAmount,
    lastPayment, setLastPayment, lastPaymentAmount, totalFinancialLease, yearlyFinancialLease, yearlyMaintenance, selectedInterest, yearlyInsurance, totalYearlyCosts, monthlyPayment, nettoInvestment
  } = props;

  return html`
  <div class="flex flex-col justify-center items-center w-full">
    <div class="Off Grid w-[65%] border border-gray-150 shadow-sm p-4 px-4 rounded-2xl bg-white">
      <div class="flex justify-between items-center">
        <div class="text-gray-500 text-lg">On Grid</div>
        <div class="text-gray-500 text-lg">YallaGreen Investment</div>
      </div>
        <div class="text-gray-900 text-3xl flex justify-between">
          <div class="flex font-bold flex-end gap-1">
            <span class="text-gray-500 text-lg self-end">€ </span>
            <span class="text-gray-900 text-3xl self-end leading-[0.9em]">${Math.round(monthlyGridCost).toLocaleString('id-ID')}</span>
            <span class="text-gray-500 text-sm font-normal self-end">/month</span>
          </div>
          <div class="flex font-bold flex-end gap-1">
            <span class="text-gray-500 text-lg self-end">€ </span>
            <span class="text-gray-900 text-3xl self-end leading-[0.9em]">
              ${Math.round(
                (
                  (((usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy) -
                    (firstPayment * (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy)) -
                    (lastPayment * (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy))) *
                    (interest)
                  ) +
                  ((usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * 0.008) +
                  ((usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * 0.005))/12
              ).toLocaleString('id-ID')}
            </span>
            <span class="text-gray-500 text-sm font-normal self-end">/month</span>
          </div>
        </div>

        <div class="border-t border-gray-150 my-5"></div>

        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 font-semibold">Assumptions</div>
            <div class="text-right flex-1"></div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 font-semibold">Price EV panels per KWh</div>
            <div class="text-right flex-1 font-semibold"><span class="text-gray-500 text-normal">€ </span>162,15</div>
          </div>

          <div class="flex justify-between items-center">
            <div class="text-left flex-1 font-semibold">Price Battery per KWh</div>
            <div class="text-right flex-1 font-semibold">
            <span class="text-gray-500 text-normal">€ </span>431</div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600">Daily need KWh EV panels</div>
            <div class="text-right flex-1 font-semibold">${usagePerDay}</div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600">Daily need KWh battery capacity</div>
            <div class="text-right flex-1 font-semibold">${Math.ceil(usagePerDay * 0.45)}</div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600">Installation costs</div>
            <div class="text-right flex-1 font-semibold">Included</div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600">Tranport, software, extra coverage</div>
            <div class="text-right flex-1 font-semibold">Included</div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600">Subsidy</div>
            <div class="text-right flex-1 font-semibold flex justify-end items-center">
              <input 
                type="number" 
                class="${tableInputClass} w-[40%]" 
                placeholder="0" 
                disabled
                oninput=${(e) => setSubsidy(Number(e.target.value) / 100)}
                value=${subsidy * 100}
              />
              <span class="ml-1">%</span>
            </div>
          </div>

          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600">Interest rate</div>
            <div class="text-right flex-1 font-semibold flex justify-end items-center">
              <select
                class="${tableInputClass} w-[40%]"
                value=${interestRate}
                disabled
                id="rate-int"
                onChange=${e => setInterestRate(e.target.value)}
              >
                ${interestTable.map(opt => html`
                  <option value=${opt.rate}>${opt.rate}</option>
                `)}
              </select>
              <span class="ml-1 invisible">%</span>
            </div>
          </div>
          
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600">Years of Loan</div>
            <div class="text-right flex-1 font-semibold flex justify-end items-center">
              <select
                class="${tableInputClass} w-[40%]"
                id="years-int"
                value=${yearsOfLoan}
                disabled
                onChange=${e => setYearsOfLoan(e.target.value)}
              >
          ${Object.entries(selectedInterest)
              .filter(([key]) => key !== "rate")
              .map(([key, value]) => html`
                    <option value=${key} data-rate=${value}>
                      ${key.replace("years", " Years")}
                    </option>
              `)
            }
              </select>
              <span class="ml-1 invisible">%</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600">Interest</div>
            <div class="text-right flex-1 font-semibold">${(interest * 100).toFixed(2)}%</div>
          </div>
        </div>

        <div class="flex flex-col gap-2 pt-5">
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 font-semibold">Investment Costs</div>
            <div class="text-right flex-1"></div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600">Solar Panels</div>
            <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal font-normal">€ </span> ${Math.ceil(usagePerDay * 162.1555).toLocaleString('id-ID')}
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600">Battery</div>
            <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal font-normal">€ </span> ${Math.ceil(usagePerDay * 0.45 * 431).toLocaleString('id-ID')}
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600 font-bold">Total investment</div>
            <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal font-normal">€ </span> ${Math.round(usagePerDay * 162.1555 + usagePerDay * 0.45 * 431).toLocaleString('id-ID')}
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600">Subsidy</div>
            <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal font-normal">€ </span> ${Math.round((usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy).toLocaleString('id-ID')}
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600 font-bold">Total netto investment</div>
            <div class="text-right flex-1 font-semibold"> 
            <span class="text-gray-500 text-normal font-normal">€ </span>
            ${Math.round(usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy).toLocaleString('id-ID')}
            </div>
          </div>
          <div class="text-left flex-1 font-semibold">Investment</div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600">First payment</div>
            <div class="text-left flex-1 font-semibold flex justify-end items-center">
              <input 
                type="number" 
                class="${tableInputClass} w-[35%]" 
                disabled
                placeholder="0" 
                oninput=${(e) => setFirstPayment(Number(e.target.value / 100))}
                value=${firstPayment * 100}
              />
              <span class="ml-1">%</span>
            </div>
            <div class="text-right flex-1 font-semibold">
            <span class="text-gray-500 text-normal font-normal">€ </span>
            ${Math.round(firstPayment * (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy)).toLocaleString('id-ID')}
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600">Last payment</div>
            <div class="text-left flex-1 font-semibold flex justify-end items-center">
              <input 
                type="number" 
                class="${tableInputClass} w-[35%]" 
                disabled
                placeholder="0" 
                oninput=${(e) => setLastPayment(Number(e.target.value / 100))}
                value=${lastPayment * 100}
              />
              <span class="ml-1">%</span>
            </div>
            <div class="text-right flex-1 font-semibold">
            <span class="text-gray-500 text-normal font-normal">€ </span>
            ${Math.round(lastPayment * (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy)).toLocaleString('id-ID')}
                </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600 font-bold">Total financial lease</div>
            <div class="text-right flex-1 font-semibold">
            <span class="text-gray-500 text-normal font-normal">€ </span>
            ${Math.round(
                (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy) -
                (firstPayment * (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy)) -
                (lastPayment * (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy))
              ).toLocaleString('id-ID')}
            </div>
          </div>

          <div class="text-left flex-1 font-semibold">Yearly costs</div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600">Financial lease</div>
            <div class="text-right flex-1 font-semibold">
            <span class="text-gray-500 text-normal font-normal">€ </span>
            ${
                Math.round(
                ((usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy) -
                (firstPayment * (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy)) -
                (lastPayment * (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy))) *
                (interest)
              ).toLocaleString('id-ID')}
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600">Maintenance & software</div>
            <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal font-normal">€ </span>
              ${Math.round((usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * 0.008).toLocaleString('id-ID')}
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600">Insurance</div>
            <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal font-normal">€ </span>
              ${Math.round((usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * 0.005).toLocaleString('id-ID')}            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600 font-bold">Total yearly costs</div>
            <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal font-normal">€ </span>
              ${Math.round(
                (
                  ((usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy) -
                  (firstPayment * (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy)) -
                  (lastPayment * (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy))) *
                  (interest)
                ) +
                ((usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * 0.008) +
                ((usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * 0.005)
              ).toLocaleString('id-ID')}
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-left flex-1 leading-tight text-gray-600 font-bold">Total monthly costs</div>
            <div class="text-right flex-1 font-semibold">
              <span class="text-gray-500 text-normal font-normal">€ </span>
              ${Math.round(
                (
                  (((usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy) -
                    (firstPayment * (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy)) -
                    (lastPayment * (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431 - (usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * subsidy))) *
                    (interest)
                  ) +
                  ((usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * 0.008) +
                  ((usagePerDay * 162.1555 + usagePerDay * 0.45 * 431) * 0.005))/12
              ).toLocaleString('id-ID')}
            </div>
          </div>
        </div>

      </div> <!-- end of on grid -->
</div>`
}

function App(props) {
  const [usagePerDay, setUsagePerDay]   = useState(250);
  const [inflationGas, setInflationGas] = useState(0.05);
  const [marketPriceGas, setMarketPriceGas] = useState(1.2);
  const [marketPriceKwh, setMarketPriceKwh] = useState(0.18);
  const [step, setStep] = useState(0);
  const [anim, setAnim] = useState("");
  const [powerOption, setPowerOption] = useState(null);
  const [pendingStep, setPendingStep] = useState(null);

  function handleNext(step = null) {
    console.log(step);
    setAnim("translate-x-full opacity-0");
    setPendingStep(step + 1);
    setTimeout(() => {
      setStep(step + 1);
      setAnim("translate-x-0 opacity-100");
      setPendingStep(null);
    }, 300);
  }

  function handlePrev(step = null) {
    console.log(step);
    setAnim("-translate-x-full opacity-0");
    setPendingStep(step - 1);
    setTimeout(() => {
      setStep(step - 1);
      setAnim("translate-x-0 opacity-100");
      setPendingStep(null);
    }, 300);
  }

  const animClass = `transition-all duration-500 ease-in-out ${anim}`;

  function renderStep(step) {
        switch (step) {
      case 0: return html`<${Step0}
              usagePerDay=${usagePerDay}
              setUsagePerDay=${setUsagePerDay}
              inflationGas=${inflationGas}
              marketPriceGas=${marketPriceGas}
        powerOption=${powerOption}
        setPowerOption=${setPowerOption}
              onNext=${handleNext}
        onPrev=${handlePrev}
            />`
      case 1: return html`<${Step1}
              usagePerDay=${usagePerDay}
              setUsagePerDay=${setUsagePerDay}
              inflationGas=${inflationGas}
              marketPriceGas=${marketPriceGas}
              setMarketPriceGas=${setMarketPriceGas}
              onNext=${handleNext}
              onPrev=${handlePrev}
            />`
      case 2: return html`<${Step2}
              usagePerDay=${usagePerDay}
              setUsagePerDay=${setUsagePerDay}
              inflationGas=${inflationGas}
              marketPriceKwh=${marketPriceKwh}
              setMarketPriceKwh=${setMarketPriceKwh}
              onPrev=${handlePrev}
              onNext=${handleNext}
            />`
      case 3: return html`<${Step3}
              usagePerDay=${usagePerDay}
              setUsagePerDay=${setUsagePerDay}
              inflationGas=${inflationGas}
              marketPriceGas=${marketPriceGas}
              marketPriceKwh=${marketPriceKwh}
              powerOption=${powerOption}
              onNext=${handleNext}
              onPrev=${handlePrev}
            />`
      case 4: return html`<${Step4}
              usagePerDay=${usagePerDay}
              setUsagePerDay=${setUsagePerDay}
              inflationGas=${inflationGas}
              marketPriceGas=${marketPriceGas}
              marketPriceKwh=${marketPriceKwh}
              onNext=${handleNext}
              onPrev=${handlePrev}
              powerOption=${powerOption}
      />`
    }
  }

  return html`
  <div class="relative overflow-hidden min-h-[400px]" style="height: 100%;">
    <div class="w-full ${animClass} overflow-auto">
      ${(() => {
        if (pendingStep !== null) {
          return html`
            <div class="absolute w-full h-full top-0 left-0">
              ${renderStep(step)}
            </div>
            <div class="absolute w-full h-full top-0 left-0">
              ${renderStep(pendingStep)}
            </div>
          `;
        }
        return renderStep(step);
      })()}
    </div>
  </div>
  `;
}

render(html`
  <${App} />`, 
  document.getElementById('prospect-calc'));
