'use client';

import React, { useState } from 'react';

export default function FleetRiskCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [animateIn, setAnimateIn] = useState(true);

  const questions = [
    {
      id: 'fleet_size',
      category: 'Fleet Profile',
      question: 'How many drivers are in your fleet?',
      type: 'single',
      options: [
        { label: '1-25 drivers', value: 'small', risk: 1 },
        { label: '26-100 drivers', value: 'medium', risk: 2 },
        { label: '101-500 drivers', value: 'large', risk: 3 },
        { label: '500+ drivers', value: 'enterprise', risk: 4 }
      ]
    },
    {
      id: 'vehicle_types',
      category: 'Fleet Profile',
      question: 'What types of vehicles does your fleet operate?',
      type: 'multi',
      options: [
        { label: 'Cars', value: 'cars', risk: 1 },
        { label: 'Vans', value: 'vans', risk: 2 },
        { label: 'HGVs / Lorries', value: 'hgv', risk: 3 },
        { label: 'Specialist vehicles', value: 'specialist', risk: 2 }
      ]
    },
    {
      id: 'annual_mileage',
      category: 'Fleet Profile',
      question: 'What is the average annual mileage per driver?',
      type: 'single',
      options: [
        { label: 'Under 10,000 miles', value: 'low', risk: 1 },
        { label: '10,000 - 25,000 miles', value: 'medium', risk: 2 },
        { label: '25,000 - 50,000 miles', value: 'high', risk: 3 },
        { label: 'Over 50,000 miles', value: 'very_high', risk: 4 }
      ]
    },
    {
      id: 'licence_checking',
      category: 'Data Visibility',
      question: 'How do you currently check driver licences?',
      type: 'single',
      options: [
        { label: 'Continuous automated checking', value: 'continuous', risk: 0 },
        { label: 'Annual or periodic manual checks', value: 'periodic', risk: 2 },
        { label: 'Only at onboarding', value: 'onboarding', risk: 3 },
        { label: "We don't have a formal process", value: 'none', risk: 5 }
      ]
    },
    {
      id: 'telematics',
      category: 'Data Visibility',
      question: 'Do you use telematics across your fleet?',
      type: 'single',
      options: [
        { label: 'Yes, with centralised reporting', value: 'full', risk: 0 },
        { label: 'Partial coverage or multiple systems', value: 'partial', risk: 2 },
        { label: 'Planning to implement', value: 'planned', risk: 3 },
        { label: 'No telematics', value: 'none', risk: 4 }
      ]
    },
    {
      id: 'claims_tracking',
      category: 'Data Visibility',
      question: 'Can you identify which drivers have the most claims?',
      type: 'single',
      options: [
        { label: 'Yes, tracked by individual driver', value: 'individual', risk: 0 },
        { label: 'Tracked at fleet/department level only', value: 'fleet', risk: 2 },
        { label: 'Reliant on insurer data', value: 'insurer', risk: 3 },
        { label: 'No visibility on claims by driver', value: 'none', risk: 5 }
      ]
    },
    {
      id: 'nip_pcn_tracking',
      category: 'Data Visibility',
      question: 'How do you track NIPs and PCNs (penalty notices)?',
      type: 'single',
      options: [
        { label: 'Automated tracking system', value: 'automated', risk: 0 },
        { label: 'Manual logging when reported', value: 'manual', risk: 2 },
        { label: 'Rely on drivers to self-report', value: 'self_report', risk: 4 },
        { label: 'No formal tracking', value: 'none', risk: 5 }
      ]
    },
    {
      id: 'risk_policy',
      category: 'Risk Management',
      question: 'Do you have a documented driver risk management policy?',
      type: 'single',
      options: [
        { label: 'Yes, actively enforced with clear consequences', value: 'enforced', risk: 0 },
        { label: 'Yes, but inconsistently applied', value: 'inconsistent', risk: 2 },
        { label: 'Informal guidelines only', value: 'informal', risk: 3 },
        { label: 'No formal policy', value: 'none', risk: 5 }
      ]
    },
    {
      id: 'driver_training',
      category: 'Risk Management',
      question: 'How do you approach driver training?',
      type: 'single',
      options: [
        { label: 'Proactive training based on risk indicators', value: 'proactive', risk: 0 },
        { label: 'Regular scheduled training for all', value: 'scheduled', risk: 1 },
        { label: 'Reactive training after incidents', value: 'reactive', risk: 3 },
        { label: 'No formal training programme', value: 'none', risk: 5 }
      ]
    },
    {
      id: 'incidents',
      category: 'Incident History',
      question: 'How many at-fault incidents has your fleet had in the last 12 months?',
      type: 'single',
      options: [
        { label: 'None', value: 'none', risk: 0 },
        { label: '1-5 incidents', value: 'few', risk: 2 },
        { label: '6-15 incidents', value: 'moderate', risk: 4 },
        { label: '15+ incidents', value: 'high', risk: 6 },
        { label: "Don't know", value: 'unknown', risk: 5 }
      ]
    }
  ];

  const handleAnswer = (questionId, value, isMulti = false) => {
    setAnswers(prev => {
      if (isMulti) {
        const current = prev[questionId] || [];
        if (current.includes(value)) {
          return { ...prev, [questionId]: current.filter(v => v !== value) };
        }
        return { ...prev, [questionId]: [...current, value] };
      }
      return { ...prev, [questionId]: value };
    });
  };

  const calculateScores = () => {
    let visibilityScore = 0;
    let managementScore = 0;
    let exposureScore = 0;
    let totalRisk = 0;
    
    const visibilityQuestions = ['licence_checking', 'telematics', 'claims_tracking', 'nip_pcn_tracking'];
    const managementQuestions = ['risk_policy', 'driver_training'];
    const exposureQuestions = ['fleet_size', 'vehicle_types', 'annual_mileage', 'incidents'];

    questions.forEach(q => {
      const answer = answers[q.id];
      if (!answer) return;

      if (q.type === 'multi') {
        const selectedOptions = q.options.filter(opt => answer.includes(opt.value));
        const avgRisk = selectedOptions.reduce((sum, opt) => sum + opt.risk, 0) / Math.max(selectedOptions.length, 1);
        
        if (exposureQuestions.includes(q.id)) exposureScore += avgRisk;
        totalRisk += avgRisk;
      } else {
        const selectedOption = q.options.find(opt => opt.value === answer);
        if (selectedOption) {
          if (visibilityQuestions.includes(q.id)) visibilityScore += selectedOption.risk;
          if (managementQuestions.includes(q.id)) managementScore += selectedOption.risk;
          if (exposureQuestions.includes(q.id)) exposureScore += selectedOption.risk;
          totalRisk += selectedOption.risk;
        }
      }
    });

    const maxVisibility = 20;
    const maxManagement = 10;
    const maxExposure = 15;
    const maxTotal = 45;

    return {
      visibility: Math.round(100 - (visibilityScore / maxVisibility * 100)),
      management: Math.round(100 - (managementScore / maxManagement * 100)),
      exposure: Math.round(100 - (exposureScore / maxExposure * 100)),
      overall: Math.round(100 - (totalRisk / maxTotal * 100))
    };
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return { level: 'Low', color: '#10B981', bg: '#D1FAE5' };
    if (score >= 60) return { level: 'Moderate', color: '#F59E0B', bg: '#FEF3C7' };
    if (score >= 40) return { level: 'Elevated', color: '#F97316', bg: '#FFEDD5' };
    return { level: 'High', color: '#EF4444', bg: '#FEE2E2' };
  };

  const nextStep = () => {
    setAnimateIn(false);
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setShowEmailCapture(true);
      }
      setAnimateIn(true);
    }, 200);
  };

  const prevStep = () => {
    setAnimateIn(false);
    setTimeout(() => {
      setCurrentStep(prev => prev - 1);
      setAnimateIn(true);
    }, 200);
  };

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    setShowEmailCapture(false);
    setShowResults(true);
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const scores = showResults ? calculateScores() : null;
  const overallRisk = scores ? getRiskLevel(scores.overall) : null;

  const isCurrentAnswered = () => {
    const answer = answers[currentQuestion?.id];
    if (!answer) return false;
    if (currentQuestion?.type === 'multi') return answer.length > 0;
    return true;
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      fontFamily: '"DM Sans", system-ui, sans-serif',
      color: '#F8FAFC',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    },
    bgDecor1: {
      position: 'absolute',
      top: '-20%',
      right: '-10%',
      width: '600px',
      height: '600px',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
      pointerEvents: 'none'
    },
    bgDecor2: {
      position: 'absolute',
      bottom: '-20%',
      left: '-10%',
      width: '500px',
      height: '500px',
      background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
      pointerEvents: 'none'
    },
    calcContainer: {
      maxWidth: '720px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    },
    card: {
      background: 'rgba(30, 41, 59, 0.8)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '24px',
      padding: '48px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    },
    logoHeader: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    logoText: {
      fontSize: '24px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #3B82F6, #10B981)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    progressBar: {
      height: '6px',
      background: 'rgba(148, 163, 184, 0.2)',
      borderRadius: '3px',
      marginBottom: '40px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #3B82F6, #10B981)',
      borderRadius: '3px',
      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      width: `${progress}%`
    },
    categoryBadge: {
      display: 'inline-block',
      padding: '6px 14px',
      background: 'rgba(59, 130, 246, 0.15)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      color: '#60A5FA',
      marginBottom: '16px'
    },
    questionText: {
      fontSize: '28px',
      fontWeight: '600',
      lineHeight: '1.3',
      marginBottom: '32px',
      color: '#F1F5F9'
    },
    optionBtn: {
      width: '100%',
      padding: '20px 24px',
      background: 'rgba(51, 65, 85, 0.5)',
      border: '2px solid rgba(148, 163, 184, 0.15)',
      borderRadius: '16px',
      color: '#E2E8F0',
      fontSize: '16px',
      fontWeight: '500',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    optionBtnSelected: {
      background: 'rgba(59, 130, 246, 0.2)',
      borderColor: '#3B82F6',
      color: '#F8FAFC'
    },
    optionIndicator: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      border: '2px solid rgba(148, 163, 184, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: 'all 0.2s ease'
    },
    optionIndicatorSelected: {
      background: '#3B82F6',
      borderColor: '#3B82F6'
    },
    checkboxIndicator: {
      width: '24px',
      height: '24px',
      borderRadius: '8px',
      border: '2px solid rgba(148, 163, 184, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: 'all 0.2s ease'
    },
    navButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '40px',
      gap: '16px'
    },
    navBtnSecondary: {
      padding: '16px 32px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: 'transparent',
      border: '2px solid rgba(148, 163, 184, 0.3)',
      color: '#94A3B8'
    },
    navBtnPrimary: {
      padding: '16px 32px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
      border: 'none',
      color: 'white',
      flex: 1,
      maxWidth: '200px'
    },
    stepCounter: {
      textAlign: 'center',
      color: '#64748B',
      fontSize: '14px',
      marginTop: '24px'
    },
    input: {
      width: '100%',
      padding: '18px 20px',
      background: 'rgba(51, 65, 85, 0.5)',
      border: '2px solid rgba(148, 163, 184, 0.15)',
      borderRadius: '12px',
      color: '#F8FAFC',
      fontSize: '16px',
      marginBottom: '16px',
      outline: 'none',
      boxSizing: 'border-box'
    },
    scoreCircle: {
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      margin: '0 auto 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },
    scoreNumber: {
      fontFamily: '"Space Mono", monospace',
      fontSize: '64px',
      fontWeight: '700',
      lineHeight: '1'
    },
    scoreLabel: {
      fontSize: '14px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      color: '#94A3B8',
      marginTop: '8px'
    },
    breakdownGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      marginBottom: '40px'
    },
    breakdownCard: {
      background: 'rgba(51, 65, 85, 0.4)',
      borderRadius: '16px',
      padding: '24px',
      textAlign: 'center'
    },
    breakdownScore: {
      fontFamily: '"Space Mono", monospace',
      fontSize: '36px',
      fontWeight: '700',
      marginBottom: '8px'
    },
    breakdownLabel: {
      fontSize: '13px',
      color: '#94A3B8',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    insightsSection: {
      background: 'rgba(51, 65, 85, 0.3)',
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '32px'
    },
    insightsTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    insightItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      padding: '16px 0',
      borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
    },
    insightIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      fontSize: '16px'
    },
    insightText: {
      fontSize: '15px',
      lineHeight: '1.6',
      color: '#CBD5E1'
    },
    ctaSection: {
      textAlign: 'center',
      padding: '32px',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(16, 185, 129, 0.1))',
      borderRadius: '20px',
      border: '1px solid rgba(59, 130, 246, 0.2)'
    },
    ctaBtn: {
      display: 'inline-block',
      padding: '18px 40px',
      background: 'linear-gradient(135deg, #10B981, #059669)',
      border: 'none',
      borderRadius: '12px',
      color: 'white',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgDecor1} />
      <div style={styles.bgDecor2} />

      <div style={styles.calcContainer}>
        <div style={styles.logoHeader}>
          <div style={styles.logoText}>Fleet Risk Assessment</div>
          <p style={{ color: '#64748B', marginTop: '8px', fontSize: '14px' }}>
            Powered by SambaSafety
          </p>
        </div>

        <div style={styles.card}>
          {!showResults && !showEmailCapture && (
            <>
              <div style={styles.progressBar}>
                <div style={styles.progressFill} />
              </div>

              <div style={{ opacity: animateIn ? 1 : 0, transform: animateIn ? 'translateX(0)' : 'translateX(20px)', transition: 'all 0.2s ease' }}>
                <span style={styles.categoryBadge}>{currentQuestion.category}</span>
                <h2 style={styles.questionText}>{currentQuestion.question}</h2>

                <div>
                  {currentQuestion.options.map((option) => {
                    const isSelected = currentQuestion.type === 'multi'
                      ? (answers[currentQuestion.id] || []).includes(option.value)
                      : answers[currentQuestion.id] === option.value;

                    return (
                      <button
                        key={option.value}
                        style={{
                          ...styles.optionBtn,
                          ...(isSelected ? styles.optionBtnSelected : {})
                        }}
                        onClick={() => handleAnswer(currentQuestion.id, option.value, currentQuestion.type === 'multi')}
                      >
                        {currentQuestion.type === 'multi' ? (
                          <span style={{
                            ...styles.checkboxIndicator,
                            ...(isSelected ? styles.optionIndicatorSelected : {})
                          }}>
                            {isSelected && (
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M11.5 4L5.5 10L2.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </span>
                        ) : (
                          <span style={{
                            ...styles.optionIndicator,
                            ...(isSelected ? styles.optionIndicatorSelected : {})
                          }}>
                            {isSelected && <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white' }} />}
                          </span>
                        )}
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                {currentQuestion.type === 'multi' && (
                  <p style={{ color: '#64748B', fontSize: '14px', marginTop: '8px' }}>
                    Select all that apply
                  </p>
                )}
              </div>

              <div style={styles.navButtons}>
                {currentStep > 0 && (
                  <button style={styles.navBtnSecondary} onClick={prevStep}>
                    ← Back
                  </button>
                )}
                <div style={{ flex: 1 }} />
                <button 
                  style={{
                    ...styles.navBtnPrimary,
                    opacity: isCurrentAnswered() ? 1 : 0.5,
                    cursor: isCurrentAnswered() ? 'pointer' : 'not-allowed'
                  }}
                  onClick={nextStep}
                  disabled={!isCurrentAnswered()}
                >
                  {currentStep === questions.length - 1 ? 'See Results' : 'Continue →'}
                </button>
              </div>

              <p style={styles.stepCounter}>
                Question {currentStep + 1} of {questions.length}
              </p>
            </>
          )}

          {showEmailCapture && (
            <div style={{ opacity: animateIn ? 1 : 0, transition: 'opacity 0.3s ease' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.2))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '32px'
                }}>
                  📊
                </div>
                <h2 style={{ ...styles.questionText, marginBottom: '16px' }}>
                  Your results are ready
                </h2>
                <p style={{ color: '#94A3B8', fontSize: '16px' }}>
                  Enter your details to see your personalised Fleet Risk Score and recommendations.
                </p>
              </div>

              <form onSubmit={handleSubmitEmail}>
                <input
                  type="text"
                  placeholder="Company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  style={styles.input}
                />
                <input
                  type="email"
                  placeholder="Work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
                />
                <button 
                  type="submit" 
                  style={{ ...styles.navBtnPrimary, width: '100%', maxWidth: '100%', marginTop: '8px' }}
                >
                  View My Results
                </button>
              </form>

              <p style={{ color: '#64748B', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>
                We'll send you a copy of your results and relevant resources.
              </p>
            </div>
          )}

          {showResults && scores && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div 
                  style={{
                    ...styles.scoreCircle,
                    background: `rgba(${overallRisk.level === 'Low' ? '16, 185, 129' : overallRisk.level === 'Moderate' ? '245, 158, 11' : overallRisk.level === 'Elevated' ? '249, 115, 22' : '239, 68, 68'}, 0.1)`
                  }}
                >
                  <span style={{ ...styles.scoreNumber, color: overallRisk.color }}>
                    {scores.overall}
                  </span>
                  <span style={styles.scoreLabel}>Risk Score</span>
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>
                  {overallRisk.level} Risk Level
                </h2>
                <p style={{ color: '#94A3B8', fontSize: '16px' }}>
                  Based on your answers across {questions.length} risk factors
                </p>
              </div>

              <div style={styles.breakdownGrid}>
                <div style={styles.breakdownCard}>
                  <div style={{ ...styles.breakdownScore, color: getRiskLevel(scores.visibility).color }}>
                    {scores.visibility}
                  </div>
                  <div style={styles.breakdownLabel}>Visibility Score</div>
                </div>
                <div style={styles.breakdownCard}>
                  <div style={{ ...styles.breakdownScore, color: getRiskLevel(scores.management).color }}>
                    {scores.management}
                  </div>
                  <div style={styles.breakdownLabel}>Management Score</div>
                </div>
                <div style={styles.breakdownCard}>
                  <div style={{ ...styles.breakdownScore, color: getRiskLevel(scores.exposure).color }}>
                    {scores.exposure}
                  </div>
                  <div style={styles.breakdownLabel}>Exposure Score</div>
                </div>
              </div>

              <div style={styles.insightsSection}>
                <h3 style={styles.insightsTitle}>
                  <span>💡</span> Key Insights
                </h3>
                
                {scores.visibility < 60 && (
                  <div style={styles.insightItem}>
                    <div style={{ ...styles.insightIcon, background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>
                      👁️
                    </div>
                    <p style={styles.insightText}>
                      <strong style={{ color: '#F1F5F9' }}>Data blind spots detected.</strong> Your current visibility into driver risk is limited. 
                      Without continuous licence checking and consolidated data, high-risk drivers can go undetected.
                    </p>
                  </div>
                )}
                
                {scores.management < 60 && (
                  <div style={styles.insightItem}>
                    <div style={{ ...styles.insightIcon, background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
                      📋
                    </div>
                    <p style={styles.insightText}>
                      <strong style={{ color: '#F1F5F9' }}>Reactive rather than proactive.</strong> Your current approach addresses risk after incidents occur. 
                      Proactive training based on early warning indicators can prevent incidents before they happen.
                    </p>
                  </div>
                )}
                
                {scores.exposure < 50 && (
                  <div style={styles.insightItem}>
                    <div style={{ ...styles.insightIcon, background: 'rgba(249, 115, 22, 0.15)', color: '#F97316' }}>
                      ⚠️
                    </div>
                    <p style={styles.insightText}>
                      <strong style={{ color: '#F1F5F9' }}>High exposure profile.</strong> Your fleet size, mileage, and vehicle mix create significant exposure. 
                      Research shows 40% of crash costs come from just 10% of drivers – identifying them early is critical.
                    </p>
                  </div>
                )}

                {scores.overall >= 70 && (
                  <div style={{ ...styles.insightItem, borderBottom: 'none' }}>
                    <div style={{ ...styles.insightIcon, background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                      ✓
                    </div>
                    <p style={styles.insightText}>
                      <strong style={{ color: '#F1F5F9' }}>Strong foundation in place.</strong> Your risk management practices are above average. 
                      There may still be opportunities to consolidate data sources and strengthen your insurer positioning.
                    </p>
                  </div>
                )}
              </div>

              <div style={styles.ctaSection}>
                <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px' }}>
                  See how SambaSafety can improve your score
                </h3>
                <p style={{ color: '#94A3B8', marginBottom: '24px', fontSize: '15px' }}>
                  Book a personalised demo to see how our Risk Cloud platform consolidates your data 
                  and gives you actionable insights to reduce fleet risk.
                </p>
                <a href="https://sambasafety.com/en-gb/demo" style={styles.ctaBtn} target="_blank" rel="noopener noreferrer">
                  Schedule a Demo
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
