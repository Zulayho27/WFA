import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './CookingMode.css';

const CookingMode = ({ steps, onExit }) => {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFinish = () => {
        if (window.confirm(t('language') === 'ru' ? 'Завершить режим готовки?' : 'Pishirish rejimini tugatish?')) {
            onExit();
        }
    };

    if (!steps || steps.length === 0) {
        return <div>No steps available</div>;
    }

    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="cooking-mode">
            <div className="cooking-mode-header">
                <button onClick={onExit} className="exit-btn">✕</button>
                <div className="progress-info">
                    <span>{t('step')} {currentStep + 1} / {steps.length}</span>
                </div>
            </div>

            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="cooking-mode-content">
                <div className="step-display">
                    <div className="step-number-large">{currentStep + 1}</div>
                    <div className="step-text-large">
                        {steps[currentStep].description}
                    </div>
                </div>
            </div>

            <div className="cooking-mode-footer">
                <button
                    onClick={handlePrevious}
                    className="btn btn-secondary btn-navigation"
                    disabled={currentStep === 0}
                >
                    ← {t('previous')}
                </button>

                {currentStep === steps.length - 1 ? (
                    <button onClick={handleFinish} className="btn btn-primary btn-navigation">
                        ✓ {t('finish')}
                    </button>
                ) : (
                    <button onClick={handleNext} className="btn btn-primary btn-navigation">
                        {t('next')} →
                    </button>
                )}
            </div>
        </div>
    );
};

export default CookingMode;
