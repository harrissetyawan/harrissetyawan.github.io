import { render } from 'preact';
import { useState } from 'preact/hooks';
import { Step0, Step1, Step2, Step3, Step4 } from './components';
import './style.css';

export function App(props) {
	const [usagePerDay, setUsagePerDay]   = useState(250);
	const [inflationGas, setInflationGas] = useState(0.05);
	const [marketPriceGas, setMarketPriceGas] = useState(1.2);
	const [marketPriceKwh, setMarketPriceKwh] = useState(0.18);
	const [step, setStep] = useState(0);
	const [anim, setAnim] = useState("");
	const [powerOption, setPowerOption] = useState(null);
	const [pendingStep, setPendingStep] = useState(null);

	function handleNext(step = null) {
		const currentStep = step;
		const maxSteps = 4;
		console.log("currentStep: ", currentStep);
		if (currentStep < maxSteps) {
			setAnim("translate-x-full opacity-0");
			setPendingStep(currentStep + 1);
			
			setTimeout(() => {
				setStep(currentStep + 1);
				setAnim("translate-x-0 opacity-100");
				setPendingStep(null);
			}, 300);
		}
	}

	function handlePrev(step = null) {
		const currentStep = step !== null ? step : step;
		
		if (currentStep > 0) {
			setAnim("-translate-x-full opacity-0");
			setPendingStep(currentStep - 1);
			
			setTimeout(() => {
				setStep(currentStep - 1);
				setAnim("translate-x-0 opacity-100");
				setPendingStep(null);
			}, 300);
		}
	}

	const animClass = `transition-all duration-500 ease-in-out ${anim}`;

	function renderStep(step) {
		console.log("step", step);
		switch (step) {
			case 0: return <Step0
				onNext={handleNext}
				setPowerOption={setPowerOption}
			/>;
			case 1: return <Step1
				usagePerDay={usagePerDay}
				setUsagePerDay={setUsagePerDay}
				inflationGas={inflationGas}
				marketPriceGas={marketPriceGas}
				setMarketPriceGas={setMarketPriceGas}
				onNext={handleNext}
				onPrev={handlePrev}
			/>;
			case 2: return <Step2
				usagePerDay={usagePerDay}
				setUsagePerDay={setUsagePerDay}
				inflationGas={inflationGas}
				marketPriceKwh={marketPriceKwh}
				setMarketPriceKwh={setMarketPriceKwh}
				onPrev={handlePrev}
				onNext={handleNext}
			/>;
			case 3: return <Step3
				usagePerDay={usagePerDay}
				setUsagePerDay={setUsagePerDay}
				inflationGas={inflationGas}
				marketPriceGas={marketPriceGas}
				setMarketPriceGas={setMarketPriceGas}
				marketPriceKwh={marketPriceKwh}
				setMarketPriceKwh={setMarketPriceKwh}
				powerOption={powerOption}
				onNext={handleNext}
				onPrev={handlePrev}
			/>;
			case 4: return <Step4
				usagePerDay={usagePerDay}
				setUsagePerDay={setUsagePerDay}
				inflationGas={inflationGas}
				marketPriceGas={marketPriceGas}
				setMarketPriceGas={setMarketPriceGas}
				marketPriceKwh={marketPriceKwh}
				setMarketPriceKwh={setMarketPriceKwh}
				powerOption={powerOption}
				onNext={handleNext}
				onPrev={handlePrev}
			/>;
		}
	}

	return (
		<div className="relative overflow-hidden min-h-[400px]" style={{ height: '100%' }}>
			<div className={`w-full ${animClass} overflow-auto`}>
				{pendingStep !== null ? (
					<>
						<div className="absolute w-full h-full top-0 left-0">
							{renderStep(step)}
						</div>
					
					</>
				) : renderStep(step)}
			</div>
		</div>
	);
}

render(<App />, document.getElementById('prospect-calc'));
