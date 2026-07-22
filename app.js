// Faculty Career Advancement System (FCAS) - Main Application Controller

class FCASApp {
  constructor() {
    this.storageKey = 'FCAS_FACULTY_DATA_V1';
    this.facultyList = this.loadData();
    this.activeFacultyId = 'fac-101'; // Default: Dr. Sarah Jenkins
    this.currentRole = 'FACULTY'; // 'FACULTY' | 'HOD' | 'IQAC'
    this.activeTab = 'dashboard'; // 'dashboard' | 'calculator' | 'eligibility' | 'hod_portal' | 'iqac_portal'
    this.theme = localStorage.getItem('FCAS_THEME') || 'dark';

    this.init();
  }

  loadData() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse stored faculty data:", e);
      }
    }
    return INITIAL_FACULTY_MEMBERS;
  }

  saveData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.facultyList));
  }

  getActiveFaculty() {
    return this.facultyList.find(f => f.id === this.activeFacultyId) || this.facultyList[0];
  }

  init() {
    document.documentElement.setAttribute('data-theme', this.theme);
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Theme toggle
    document.addEventListener('click', (e) => {
      if (e.target.closest('#themeToggleBtn')) {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('FCAS_THEME', this.theme);
        this.render();
      }
    });
  }

  setRole(role) {
    this.currentRole = role;
    if (role === 'HOD') {
      this.activeTab = 'hod_portal';
    } else if (role === 'IQAC') {
      this.activeTab = 'iqac_portal';
    } else {
      this.activeTab = 'dashboard';
    }
    this.render();
  }

  setActiveFaculty(id) {
    this.activeFacultyId = id;
    this.render();
  }

  setTab(tab) {
    this.activeTab = tab;
    this.render();
  }

  render() {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    const activeFaculty = this.getActiveFaculty();
    const scores = calculateFacultyScores(activeFaculty);

    appContainer.innerHTML = `
      <div class="min-h-screen flex flex-col">
        ${this.renderHeader()}
        <main class="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
          ${this.renderRoleSubHeader(activeFaculty)}
          ${this.renderMainContent(activeFaculty, scores)}
        </main>
        ${this.renderFooter()}
      </div>
      ${this.renderModals(activeFaculty, scores)}
    `;

    this.attachDynamicListeners();
    lucide.createIcons();
  }

  renderHeader() {
    const activeFaculty = this.getActiveFaculty();

    return `
      <header class="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-slate-100">
        <div class="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          
          <!-- Logo & Title -->
          <div class="flex items-center gap-3">
            <img src="assets/university_crest.jpg" alt="University Emblem" class="w-10 h-10 rounded-full border border-amber-500/40 shadow-sm object-cover" />
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-lg tracking-tight gradient-text">Apex University</span>
                <span class="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded font-mono border border-indigo-500/30">CAS v2.4</span>
              </div>
              <p class="text-xs text-slate-400 font-medium hidden sm:block">Faculty Career Advancement & Performance Assessment System</p>
            </div>
          </div>

          <!-- Role Selector Switcher -->
          <div class="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 shadow-inner">
            <button 
              onclick="app.setRole('FACULTY')" 
              class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${this.currentRole === 'FACULTY' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
            >
              <i data-lucide="user" class="w-3.5 h-3.5"></i>
              Faculty Portal
            </button>

            <button 
              onclick="app.setRole('HOD')" 
              class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${this.currentRole === 'HOD' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
            >
              <i data-lucide="users" class="w-3.5 h-3.5"></i>
              HOD Portal
            </button>

            <button 
              onclick="app.setRole('IQAC')" 
              class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${this.currentRole === 'IQAC' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
            >
              <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
              IQAC / Committee
            </button>
          </div>

          <!-- User & Theme Control -->
          <div class="flex items-center gap-3">
            <!-- Faculty Selector Dropdown -->
            <select 
              onchange="app.setActiveFaculty(this.value)" 
              class="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500"
            >
              ${this.facultyList.map(f => `
                <option value="${f.id}" ${f.id === activeFaculty.id ? 'selected' : ''}>
                  ${f.name} (${f.department.split(' ')[0]})
                </option>
              `).join('')}
            </select>

            <button id="themeToggleBtn" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
              <i data-lucide="${this.theme === 'dark' ? 'sun' : 'moon'}" class="w-4 h-4"></i>
            </button>
          </div>

        </div>
      </header>
    `;
  }

  renderRoleSubHeader(activeFaculty) {
    if (this.currentRole === 'FACULTY') {
      return `
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div class="flex items-center gap-3">
            <img src="${activeFaculty.avatar}" class="w-12 h-12 rounded-full border-2 border-indigo-500 object-cover shadow" alt="${activeFaculty.name}" />
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-xl font-bold text-slate-100">${activeFaculty.name}</h1>
                <span class="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded border border-slate-700">${activeFaculty.qualification}</span>
              </div>
              <p class="text-xs text-slate-400">${activeFaculty.designation} • ${activeFaculty.department}</p>
            </div>
          </div>

          <!-- Faculty Navigation Tabs -->
          <div class="flex items-center gap-2 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button 
              onclick="app.setTab('dashboard')" 
              class="px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${this.activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
            >
              <i data-lucide="layout-dashboard" class="w-4 h-4"></i> Overview
            </button>
            <button 
              onclick="app.setTab('calculator')" 
              class="px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${this.activeTab === 'calculator' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
            >
              <i data-lucide="calculator" class="w-4 h-4"></i> API Calculator
            </button>
            <button 
              onclick="app.setTab('eligibility')" 
              class="px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${this.activeTab === 'eligibility' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}"
            >
              <i data-lucide="award" class="w-4 h-4"></i> CAS Matrix
            </button>
          </div>
        </div>
      `;
    } else if (this.currentRole === 'HOD') {
      return `
        <div class="bg-indigo-950/40 border border-indigo-800/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <i data-lucide="building" class="w-6 h-6"></i>
            </div>
            <div>
              <h1 class="text-lg font-bold text-slate-100">Head of Department (HOD) Evaluation Desk</h1>
              <p class="text-xs text-slate-400">Review department faculty appraisal applications, verify academic claims & endorse CAS applications.</p>
            </div>
          </div>

          <div class="flex items-center gap-2 text-xs">
            <span class="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300">
              Department: <strong>Computer Science & Electrical</strong>
            </span>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="bg-emerald-950/40 border border-emerald-800/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <i data-lucide="shield-check" class="w-6 h-6"></i>
            </div>
            <div>
              <h1 class="text-lg font-bold text-slate-100">IQAC & Selection Committee Audit Portal</h1>
              <p class="text-xs text-slate-400">University level verification, document audit, statutory compliance check, and official scorecard generation.</p>
            </div>
          </div>

          <div class="flex items-center gap-2 text-xs">
            <span class="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300">
              Status: <strong>Statutory Audit Ready</strong>
            </span>
          </div>
        </div>
      `;
    }
  }

  renderMainContent(activeFaculty, scores) {
    if (this.currentRole === 'FACULTY') {
      if (this.activeTab === 'calculator') return this.renderApiCalculator(activeFaculty, scores);
      if (this.activeTab === 'eligibility') return this.renderEligibilityMatrix(activeFaculty, scores);
      return this.renderFacultyDashboard(activeFaculty, scores);
    } else if (this.currentRole === 'HOD') {
      return this.renderHodPortal();
    } else {
      return this.renderIqacPortal();
    }
  }

  renderFacultyDashboard(activeFaculty, scores) {
    const targetRule = scores.rule;
    const progressPercent = Math.min(100, Math.round((scores.grandTotal / (targetRule?.minTotalApi || 200)) * 100));

    return `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left 2 Cols: Main Stats & Achievements -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Promotion Status Banner -->
          <div class="glass-panel p-6 relative overflow-hidden">
            <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
              <i data-lucide="award" class="w-64 h-64 text-indigo-400"></i>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <span class="text-xs uppercase tracking-wider font-semibold text-indigo-400">Career Advancement Status</span>
                <h2 class="text-xl font-bold text-slate-100 mt-0.5">
                  Level ${activeFaculty.currentLevel} → Level ${activeFaculty.targetLevel} Promotion
                </h2>
                <p class="text-xs text-slate-400 mt-1">${targetRule ? targetRule.titleTo : 'Senior Rank Advancement'}</p>
              </div>

              ${this.getStatusBadge(activeFaculty.applicationStatus)}
            </div>

            <!-- Progress Meter -->
            <div class="space-y-2 mt-4">
              <div class="flex justify-between text-xs font-semibold">
                <span class="text-slate-300">Total API Score Achieved: <strong class="text-indigo-400">${scores.grandTotal} Points</strong></span>
                <span class="text-slate-400">Required Benchmark: ${targetRule ? targetRule.minTotalApi : 200} Points (${progressPercent}%)</span>
              </div>
              <div class="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                <div class="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-1000 shadow-lg" style="width: ${progressPercent}%"></div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3 mt-6 pt-4 border-t border-slate-800">
              <button onclick="app.openModal('addRecord')" class="btn btn-primary">
                <i data-lucide="plus-circle" class="w-4 h-4"></i> Add Paper / Patent / Project
              </button>

              ${activeFaculty.applicationStatus === 'DRAFT' || activeFaculty.applicationStatus === 'SUBMITTED' ? `
                <button onclick="app.submitApplication()" class="btn btn-success">
                  <i data-lucide="send" class="w-4 h-4"></i> ${activeFaculty.applicationStatus === 'SUBMITTED' ? 'Re-Submit Application' : 'Submit to HOD for Appraisal'}
                </button>
              ` : ''}

              <button onclick="app.openModal('scorecard')" class="btn btn-secondary">
                <i data-lucide="printer" class="w-4 h-4"></i> View Official Committee Scorecard
              </button>
            </div>
          </div>

          <!-- Category Score Summary Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="glass-panel p-4 space-y-2 border-l-4 border-l-indigo-500">
              <div class="flex items-center justify-between text-slate-400 text-xs">
                <span>Category I (Teaching)</span>
                <i data-lucide="book-open" class="w-4 h-4 text-indigo-400"></i>
              </div>
              <div class="text-2xl font-bold text-slate-100">${scores.cat1Total} <span class="text-xs font-normal text-slate-400">pts</span></div>
              <div class="text-xs text-emerald-400 flex items-center gap-1">
                <i data-lucide="check-circle" class="w-3 h-3"></i> Cutoff: ${targetRule ? targetRule.minCat1Points : 80} pts
              </div>
            </div>

            <div class="glass-panel p-4 space-y-2 border-l-4 border-l-purple-500">
              <div class="flex items-center justify-between text-slate-400 text-xs">
                <span>Category II (Co-Curricular)</span>
                <i data-lucide="briefcase" class="w-4 h-4 text-purple-400"></i>
              </div>
              <div class="text-2xl font-bold text-slate-100">${scores.cat2Total} <span class="text-xs font-normal text-slate-400">pts</span></div>
              <div class="text-xs text-emerald-400 flex items-center gap-1">
                <i data-lucide="check-circle" class="w-3 h-3"></i> Cutoff: ${targetRule ? targetRule.minCat2Points : 35} pts
              </div>
            </div>

            <div class="glass-panel p-4 space-y-2 border-l-4 border-l-emerald-500">
              <div class="flex items-center justify-between text-slate-400 text-xs">
                <span>Category III (Research)</span>
                <i data-lucide="flask-conical" class="w-4 h-4 text-emerald-400"></i>
              </div>
              <div class="text-2xl font-bold text-slate-100">${scores.cat3Total} <span class="text-xs font-normal text-slate-400">pts</span></div>
              <div class="text-xs text-emerald-400 flex items-center gap-1">
                <i data-lucide="check-circle" class="w-3 h-3"></i> Cutoff: ${targetRule ? targetRule.minCat3Points : 75} pts
              </div>
            </div>
          </div>

          <!-- Academic Portfolio Table -->
          <div class="glass-panel p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-slate-100 text-base flex items-center gap-2">
                <i data-lucide="file-text" class="w-4 h-4 text-indigo-400"></i>
                Research Publications & Patents Log
              </h3>
              <span class="text-xs text-slate-400">${activeFaculty.cat3Research.length} Entries Logged</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs text-slate-300">
                <thead class="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th class="p-3">Title & Journal</th>
                    <th class="p-3">Type</th>
                    <th class="p-3">Impact Factor</th>
                    <th class="p-3">API Points</th>
                    <th class="p-3">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800">
                  ${activeFaculty.cat3Research.map(r => `
                    <tr class="hover:bg-slate-800/40 transition-colors">
                      <td class="p-3">
                        <div class="font-semibold text-slate-200 line-clamp-1">${r.title}</div>
                        <div class="text-[11px] text-slate-400">${r.journal} (${r.year})</div>
                        <div class="text-[10px] text-indigo-400 font-mono">DOI: ${r.doi}</div>
                      </td>
                      <td class="p-3">
                        <span class="bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                          ${r.type}
                        </span>
                      </td>
                      <td class="p-3 font-semibold text-amber-400">
                        ${r.impactFactor ? `IF: ${r.impactFactor}` : 'N/A'}
                      </td>
                      <td class="p-3 font-bold text-indigo-400">+${r.points}</td>
                      <td class="p-3">
                        <span class="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <i data-lucide="check-check" class="w-3 h-3"></i> Verified
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- Right Col: Eligibility Status & HOD Review Summary -->
        <div class="space-y-6">

          <!-- Eligibility Meter Card -->
          <div class="glass-panel p-6 space-y-4">
            <h3 class="font-bold text-slate-100 text-sm flex items-center justify-between">
              <span>Statutory Eligibility Check</span>
              <i data-lucide="${scores.isEligible ? 'check-circle' : 'alert-circle'}" class="w-5 h-5 ${scores.isEligible ? 'text-emerald-400' : 'text-amber-400'}"></i>
            </h3>

            <div class="p-3 rounded-xl ${scores.isEligible ? 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300' : 'bg-amber-950/40 border border-amber-800/40 text-amber-300'} text-xs space-y-1">
              <div class="font-semibold flex items-center gap-1.5">
                <i data-lucide="${scores.isEligible ? 'sparkles' : 'clock'}" class="w-4 h-4"></i>
                ${scores.isEligible ? 'Eligible for Level Promotion!' : 'Minimum Benchmark Criteria Incomplete'}
              </div>
              <p class="text-[11px] text-slate-300 opacity-90">
                ${scores.isEligible 
                  ? 'All mandatory UGC service years, publications, and category cutoffs have been fulfilled.' 
                  : 'Review the missing criteria checklist below before applying.'}
              </p>
            </div>

            <!-- Breakdown Checklist -->
            <div class="space-y-2.5 pt-2">
              ${scores.eligibilityChecklist.map(item => `
                <div class="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-800/50 border border-slate-800">
                  <span class="text-slate-300 truncate max-w-[200px]" title="${item.criterion}">${item.criterion}</span>
                  <span class="font-bold ${item.met ? 'text-emerald-400' : 'text-amber-400'} flex items-center gap-1">
                    ${item.current}
                    <i data-lucide="${item.met ? 'check' : 'x'}" class="w-3.5 h-3.5"></i>
                  </span>
                </div>
              `).join('')}
            </div>

            <button onclick="app.setTab('eligibility')" class="w-full btn btn-secondary text-xs">
              View UGC Rulebook Matrix
            </button>
          </div>

          <!-- Endorsement & Remarks Card -->
          <div class="glass-panel p-6 space-y-4">
            <h3 class="font-bold text-slate-100 text-sm flex items-center gap-2">
              <i data-lucide="message-square" class="w-4 h-4 text-indigo-400"></i>
              Appraisal Endorsements & Audit Remarks
            </h3>

            <!-- HOD Section -->
            <div class="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold text-indigo-300">HOD Endorsement</span>
                ${activeFaculty.hodEndorsement ? '<span class="text-emerald-400 font-mono text-[10px]">APPROVED</span>' : '<span class="text-slate-400 font-mono text-[10px]">PENDING</span>'}
              </div>
              <p class="text-xs text-slate-300 italic">
                "${activeFaculty.hodEndorsement ? activeFaculty.hodEndorsement.comments : 'Awaiting Department Head Review.'}"
              </p>
              ${activeFaculty.hodEndorsement ? `<div class="text-[10px] text-slate-400 text-right">— ${activeFaculty.hodEndorsement.evaluatorName} (${activeFaculty.hodEndorsement.evaluatedDate})</div>` : ''}
            </div>

            <!-- IQAC Section -->
            <div class="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold text-emerald-300">IQAC Statutory Audit</span>
                ${activeFaculty.iqacAudit ? '<span class="text-cyan-400 font-mono text-[10px]">VERIFIED</span>' : '<span class="text-slate-400 font-mono text-[10px]">AWAITING AUDIT</span>'}
              </div>
              <p class="text-xs text-slate-300 italic">
                "${activeFaculty.iqacAudit ? activeFaculty.iqacAudit.remarks : 'Pending final IQAC document verification.'}"
              </p>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  renderApiCalculator(activeFaculty, scores) {
    return `
      <div class="space-y-6">
        <div class="glass-panel p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-slate-100">UGC Performance Based Appraisal System (PBAS) Calculator</h2>
            <p class="text-xs text-slate-400">Interactive Category-wise point calculator & weightage breakdown.</p>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400">Grand Total API Score</span>
            <div class="text-3xl font-extrabold gradient-text">${scores.grandTotal} Points</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Category I -->
          <div class="glass-panel p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 class="font-bold text-slate-100 text-sm">Category I: Teaching & Evaluation</h3>
              <span class="bg-indigo-500/20 text-indigo-400 font-bold px-2 py-0.5 rounded text-xs">${scores.cat1Total} Pts</span>
            </div>

            <div class="space-y-3">
              ${activeFaculty.cat1Teaching.map(t => `
                <div class="p-3 bg-slate-800/50 rounded-lg border border-slate-800 text-xs space-y-1">
                  <div class="font-semibold text-slate-200">${t.title}</div>
                  <div class="text-slate-400 text-[11px]">${t.hoursPerWeek} hrs/week • ${t.semesters}</div>
                  <div class="text-right font-bold text-indigo-400">+${t.points} pts</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Category II -->
          <div class="glass-panel p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 class="font-bold text-slate-100 text-sm">Category II: Professional Dev & Co-Curricular</h3>
              <span class="bg-purple-500/20 text-purple-400 font-bold px-2 py-0.5 rounded text-xs">${scores.cat2Total} Pts</span>
            </div>

            <div class="space-y-3">
              ${activeFaculty.cat2Development.map(d => `
                <div class="p-3 bg-slate-800/50 rounded-lg border border-slate-800 text-xs space-y-1">
                  <div class="font-semibold text-slate-200">${d.title}</div>
                  <div class="text-slate-400 text-[11px]">Role: ${d.role} • ${d.year}</div>
                  <div class="text-right font-bold text-purple-400">+${d.points} pts</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Category III -->
          <div class="glass-panel p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 class="font-bold text-slate-100 text-sm">Category III: Research & Publications</h3>
              <span class="bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded text-xs">${scores.cat3Total} Pts</span>
            </div>

            <div class="space-y-3">
              ${activeFaculty.cat3Research.slice(0, 4).map(r => `
                <div class="p-3 bg-slate-800/50 rounded-lg border border-slate-800 text-xs space-y-1">
                  <div class="font-semibold text-slate-200 truncate" title="${r.title}">${r.title}</div>
                  <div class="text-slate-400 text-[11px]">${r.type} (${r.year})</div>
                  <div class="text-right font-bold text-emerald-400">+${r.points} pts</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderEligibilityMatrix(activeFaculty, scores) {
    return `
      <div class="space-y-6">
        <div class="glass-panel p-6">
          <h2 class="text-lg font-bold text-slate-100 mb-2">UGC Career Advancement Scheme (CAS) Statutory Level Matrix</h2>
          <p class="text-xs text-slate-400">Complete breakdown of promotion guidelines across academic levels.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${Object.keys(CAS_LEVEL_RULES).map(key => {
            const rule = CAS_LEVEL_RULES[key];
            const isCurrentRule = `${activeFaculty.currentLevel}_to_${activeFaculty.targetLevel}` === key;

            return `
              <div class="glass-panel p-6 space-y-4 relative ${isCurrentRule ? 'border-2 border-indigo-500 ring-4 ring-indigo-500/10' : ''}">
                ${isCurrentRule ? '<span class="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Your Active Goal</span>' : ''}
                
                <div>
                  <h3 class="font-bold text-slate-100 text-base">${rule.titleFrom} → ${rule.titleTo}</h3>
                  <p class="text-xs text-slate-400 mt-1">${rule.description}</p>
                </div>

                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div class="p-2 bg-slate-800/60 rounded">Min Service: <strong>${rule.minServiceYears} Years</strong></div>
                  <div class="p-2 bg-slate-800/60 rounded">Total API Threshold: <strong>${rule.minTotalApi} Pts</strong></div>
                  <div class="p-2 bg-slate-800/60 rounded">Category I Cutoff: <strong>${rule.minCat1Points} Pts</strong></div>
                  <div class="p-2 bg-slate-800/60 rounded">Category III Cutoff: <strong>${rule.minCat3Points} Pts</strong></div>
                  <div class="p-2 bg-slate-800/60 rounded">Mandatory Papers: <strong>${rule.minPublications}</strong></div>
                  <div class="p-2 bg-slate-800/60 rounded">FDP Courses: <strong>${rule.requiredFdpCount}</strong></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  renderHodPortal() {
    const pendingFac = this.facultyList.filter(f => f.applicationStatus === 'SUBMITTED');
    const approvedFac = this.facultyList.filter(f => f.applicationStatus === 'HOD_APPROVED' || f.applicationStatus === 'IQAC_VERIFIED');

    return `
      <div class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="glass-panel p-4">
            <span class="text-xs text-slate-400">Applications Pending HOD Review</span>
            <div class="text-2xl font-bold text-amber-400 mt-1">${pendingFac.length} Applications</div>
          </div>
          <div class="glass-panel p-4">
            <span class="text-xs text-slate-400">Endorsed & Forwarded to IQAC</span>
            <div class="text-2xl font-bold text-emerald-400 mt-1">${approvedFac.length} Applications</div>
          </div>
          <div class="glass-panel p-4">
            <span class="text-xs text-slate-400">Total Department Faculty</span>
            <div class="text-2xl font-bold text-slate-100 mt-1">${this.facultyList.length} Members</div>
          </div>
        </div>

        <div class="glass-panel p-6 space-y-4">
          <h3 class="font-bold text-slate-100 text-base">Faculty Appraisal Evaluation Queue</h3>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th class="p-3">Faculty Member</th>
                  <th class="p-3">Promotion Path</th>
                  <th class="p-3">API Score</th>
                  <th class="p-3">Status</th>
                  <th class="p-3 text-right">HOD Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                ${this.facultyList.map(f => {
                  const s = calculateFacultyScores(f);
                  return `
                    <tr class="hover:bg-slate-800/40">
                      <td class="p-3">
                        <div class="font-semibold text-slate-200">${f.name}</div>
                        <div class="text-[11px] text-slate-400">${f.department}</div>
                      </td>
                      <td class="p-3 font-mono">Level ${f.currentLevel} → ${f.targetLevel}</td>
                      <td class="p-3 font-bold text-indigo-400">${s.grandTotal} Pts</td>
                      <td class="p-3">${this.getStatusBadge(f.applicationStatus)}</td>
                      <td class="p-3 text-right">
                        ${f.applicationStatus === 'SUBMITTED' ? `
                          <button onclick="app.openHodEvaluationModal('${f.id}')" class="btn btn-primary text-xs py-1 px-3">
                            Review & Endorse
                          </button>
                        ` : `
                          <button onclick="app.openHodEvaluationModal('${f.id}')" class="btn btn-secondary text-xs py-1 px-3">
                            View Review
                          </button>
                        `}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  renderIqacPortal() {
    return `
      <div class="space-y-6">
        <div class="glass-panel p-6 space-y-4">
          <h3 class="font-bold text-slate-100 text-base">IQAC University Audit & Verification Table</h3>
          <p class="text-xs text-slate-400">Audit scores, verify SCOPUS / SCI DOIs, and approve selection committee scorecards.</p>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th class="p-3">Faculty & Dept</th>
                  <th class="p-3">Target Level</th>
                  <th class="p-3">Claimed API</th>
                  <th class="p-3">HOD Endorsement</th>
                  <th class="p-3">IQAC Status</th>
                  <th class="p-3 text-right">Audit Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                ${this.facultyList.map(f => {
                  const s = calculateFacultyScores(f);
                  return `
                    <tr class="hover:bg-slate-800/40">
                      <td class="p-3">
                        <div class="font-semibold text-slate-200">${f.name}</div>
                        <div class="text-[11px] text-slate-400">${f.department}</div>
                      </td>
                      <td class="p-3 font-mono">Level ${f.targetLevel}</td>
                      <td class="p-3 font-bold text-indigo-400">${s.grandTotal} Pts</td>
                      <td class="p-3 text-emerald-400 text-[11px]">
                        ${f.hodEndorsement ? '✓ Verified by HOD' : 'Pending HOD'}
                      </td>
                      <td class="p-3">${this.getStatusBadge(f.applicationStatus)}</td>
                      <td class="p-3 text-right">
                        <button onclick="app.openIqacAuditModal('${f.id}')" class="btn btn-secondary text-xs py-1 px-3">
                          <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Audit Scorecard
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  renderFooter() {
    return `
      <footer class="border-t border-slate-800/80 bg-slate-900/60 py-6 text-center text-xs text-slate-500">
        <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong>Apex University</strong> • Faculty Career Advancement & Performance Evaluation System
          </div>
          <div>
            Aligned with UGC Regulations on Minimum Qualifications for Appointment & Career Advancement (CAS).
          </div>
        </div>
      </footer>
    `;
  }

  getStatusBadge(status) {
    if (status === 'SUBMITTED') return '<span class="badge badge-submitted">Pending HOD Review</span>';
    if (status === 'HOD_APPROVED') return '<span class="badge badge-approved">HOD Endorsed</span>';
    if (status === 'IQAC_VERIFIED') return '<span class="badge badge-verified">IQAC Audit Verified</span>';
    if (status === 'PROMOTED') return '<span class="badge badge-approved">Promoted</span>';
    return '<span class="badge badge-draft">Draft</span>';
  }

  renderModals(activeFaculty, scores) {
    return `
      <!-- Add Record Modal -->
      <div id="addRecordModal" class="modal-overlay">
        <div class="modal-container glass-panel p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="font-bold text-slate-100 text-base">Add New Academic Record / Achievement</h3>
            <button onclick="app.closeModal('addRecord')" class="text-slate-400 hover:text-slate-200"><i data-lucide="x" class="w-5 h-5"></i></button>
          </div>

          <form id="addRecordForm" onsubmit="app.handleAddRecord(event)" class="space-y-4 text-xs">
            <div>
              <label class="block text-slate-300 font-semibold mb-1">Title / Publication Name</label>
              <input type="text" id="recordTitle" required class="form-control" placeholder="e.g. Deep Learning for Medical Diagnostics" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-slate-300 font-semibold mb-1">Journal / Publisher / Sanctioning Body</label>
                <input type="text" id="recordJournal" required class="form-control" placeholder="e.g. IEEE TPAMI / DST-SERB" />
              </div>

              <div>
                <label class="block text-slate-300 font-semibold mb-1">Category Type</label>
                <select id="recordType" required class="form-control">
                  <option value="SCI Journal">Peer Reviewed SCI/Scopus Journal (+25 Pts)</option>
                  <option value="Patent (Granted)">Granted Patent (+22 Pts)</option>
                  <option value="Sponsored Project">Sponsored Research Project (+20 Pts)</option>
                  <option value="Book Chapter">Book / Chapter (+15 Pts)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-slate-300 font-semibold mb-1">Impact Factor (IF)</label>
                <input type="number" step="0.1" id="recordImpact" class="form-control" placeholder="0.0" />
              </div>

              <div>
                <label class="block text-slate-300 font-semibold mb-1">Publication Year</label>
                <input type="number" id="recordYear" value="2025" class="form-control" />
              </div>

              <div>
                <label class="block text-slate-300 font-semibold mb-1">DOI / Patent No.</label>
                <input type="text" id="recordDoi" class="form-control" placeholder="10.1109/..." />
              </div>
            </div>

            <div class="pt-4 flex justify-end gap-3 border-t border-slate-800">
              <button type="button" onclick="app.closeModal('addRecord')" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Save & Calculate Points</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Scorecard Modal -->
      <div id="scorecardModal" class="modal-overlay">
        <div class="modal-container glass-panel p-8 space-y-6 max-w-4xl bg-slate-900 text-slate-100">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4 no-print">
            <h3 class="font-bold text-slate-100 text-lg">Official University Selection Committee Scorecard</h3>
            <div class="flex items-center gap-2">
              <button onclick="window.print()" class="btn btn-primary text-xs"><i data-lucide="printer" class="w-4 h-4"></i> Print Scorecard</button>
              <button onclick="app.closeModal('scorecard')" class="text-slate-400 hover:text-slate-200"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>
          </div>

          <!-- Scorecard Content -->
          <div class="space-y-6 p-4 border border-slate-700/60 rounded-xl bg-slate-950/80">
            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
              <div class="flex items-center gap-3">
                <img src="assets/university_crest.jpg" class="w-12 h-12 rounded-full border border-amber-500/40" />
                <div>
                  <h2 class="text-lg font-bold text-white uppercase tracking-wider">APEX UNIVERSITY</h2>
                  <p class="text-xs text-slate-400">Office of the Internal Quality Assurance Cell (IQAC)</p>
                </div>
              </div>
              <div class="text-right text-xs">
                <div class="font-mono text-indigo-400 font-bold">CAS-APP-${activeFaculty.id.toUpperCase()}</div>
                <div class="text-slate-400">Date: 2026-07-21</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-xs bg-slate-900 p-4 rounded-lg border border-slate-800">
              <div><strong>Candidate:</strong> ${activeFaculty.name}</div>
              <div><strong>Department:</strong> ${activeFaculty.department}</div>
              <div><strong>Current Cadre:</strong> Level ${activeFaculty.currentLevel}</div>
              <div><strong>Applied Cadre:</strong> Level ${activeFaculty.targetLevel}</div>
            </div>

            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-slate-800 text-slate-300">
                  <th class="p-2 border border-slate-700">Assessment Category</th>
                  <th class="p-2 border border-slate-700">Minimum Cutoff</th>
                  <th class="p-2 border border-slate-700">Claimed Points</th>
                  <th class="p-2 border border-slate-700">IQAC Verified</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="p-2 border border-slate-800">Cat I: Teaching & Evaluation</td>
                  <td class="p-2 border border-slate-800">${scores.rule?.minCat1Points || 80}</td>
                  <td class="p-2 border border-slate-800">${scores.cat1Total}</td>
                  <td class="p-2 border border-slate-800 text-emerald-400 font-bold">${scores.cat1Total}</td>
                </tr>
                <tr>
                  <td class="p-2 border border-slate-800">Cat II: Co-Curricular & Dev</td>
                  <td class="p-2 border border-slate-800">${scores.rule?.minCat2Points || 35}</td>
                  <td class="p-2 border border-slate-800">${scores.cat2Total}</td>
                  <td class="p-2 border border-slate-800 text-emerald-400 font-bold">${scores.cat2Total}</td>
                </tr>
                <tr>
                  <td class="p-2 border border-slate-800">Cat III: Research Contributions</td>
                  <td class="p-2 border border-slate-800">${scores.rule?.minCat3Points || 75}</td>
                  <td class="p-2 border border-slate-800">${scores.cat3Total}</td>
                  <td class="p-2 border border-slate-800 text-emerald-400 font-bold">${scores.cat3Total}</td>
                </tr>
                <tr class="bg-slate-800/80 font-bold text-slate-100">
                  <td class="p-2 border border-slate-700">GRAND TOTAL API SCORE</td>
                  <td class="p-2 border border-slate-700">${scores.rule?.minTotalApi || 190}</td>
                  <td class="p-2 border border-slate-700">${scores.grandTotal}</td>
                  <td class="p-2 border border-slate-700 text-emerald-400 font-bold">${scores.grandTotal}</td>
                </tr>
              </tbody>
            </table>

            <div class="grid grid-cols-2 gap-8 pt-8 text-center text-xs text-slate-400">
              <div class="border-t border-slate-700 pt-2">
                <strong>Head of Department (HOD) Signature</strong>
              </div>
              <div class="border-t border-slate-700 pt-2">
                <strong>IQAC Convener / Selection Committee Chairman</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachDynamicListeners() {
    // Dynamic event bindings if necessary
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId + 'Modal');
    if (modal) modal.classList.add('active');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId + 'Modal');
    if (modal) modal.classList.remove('active');
  }

  handleAddRecord(e) {
    e.preventDefault();
    const activeFaculty = this.getActiveFaculty();

    const title = document.getElementById('recordTitle').value;
    const journal = document.getElementById('recordJournal').value;
    const type = document.getElementById('recordType').value;
    const impactFactor = parseFloat(document.getElementById('recordImpact').value) || 0;
    const year = parseInt(document.getElementById('recordYear').value) || 2025;
    const doi = document.getElementById('recordDoi').value || 'Pending';

    let points = 20;
    if (type === 'SCI Journal') points = 25 + (impactFactor > 10 ? 5 : 0);
    if (type === 'Patent (Granted)') points = 22;
    if (type === 'Sponsored Project') points = 20;

    activeFaculty.cat3Research.unshift({
      id: 'r-' + Date.now(),
      title,
      journal,
      type,
      year,
      impactFactor,
      doi,
      authorship: 'Lead Author',
      points,
      status: 'VERIFIED'
    });

    this.saveData();
    this.closeModal('addRecord');
    this.render();
  }

  submitApplication() {
    const activeFaculty = this.getActiveFaculty();
    activeFaculty.applicationStatus = 'SUBMITTED';
    this.saveData();
    alert(`Application for promotion to Level ${activeFaculty.targetLevel} successfully submitted to Head of Department (HOD)!`);
    this.render();
  }

  openHodEvaluationModal(facultyId) {
    const faculty = this.facultyList.find(f => f.id === facultyId);
    if (!faculty) return;

    const comments = prompt(`Enter HOD Evaluation Comments & Endorsement for ${faculty.name}:`, faculty.hodEndorsement?.comments || "Recommended for CAS Promotion.");
    if (comments !== null) {
      faculty.hodEndorsement = {
        status: 'APPROVED',
        comments: comments,
        evaluatedDate: '2026-07-21',
        evaluatorName: 'Prof. Department Chair'
      };
      faculty.applicationStatus = 'HOD_APPROVED';
      this.saveData();
      this.render();
    }
  }

  openIqacAuditModal(facultyId) {
    const faculty = this.facultyList.find(f => f.id === facultyId);
    if (!faculty) return;

    const remarks = prompt(`IQAC Audit Remarks for ${faculty.name}:`, faculty.iqacAudit?.remarks || "All publication DOIs and service records verified against UGC norms.");
    if (remarks !== null) {
      const scores = calculateFacultyScores(faculty);
      faculty.iqacAudit = {
        status: 'VERIFIED',
        verifiedCat1: scores.cat1Total,
        verifiedCat2: scores.cat2Total,
        verifiedCat3: scores.cat3Total,
        verifiedTotal: scores.grandTotal,
        remarks: remarks,
        auditDate: '2026-07-21',
        auditorName: 'Dr. University IQAC Director'
      };
      faculty.applicationStatus = 'IQAC_VERIFIED';
      this.saveData();
      this.render();
    }
  }
}

// Global App Instance
let app;
window.addEventListener('DOMContentLoaded', () => {
  app = new FCASApp();
});
