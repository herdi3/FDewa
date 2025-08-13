import React, { useState, useEffect } from 'react';
import { ViewType, Client, Project, TeamMember, Transaction, Package, AddOn, TeamProjectPayment, Profile, FinancialPocket, TeamPaymentRecord, Lead, RewardLedgerEntry, User, Card, Asset, ClientFeedback, Contract, RevisionStatus, NavigationAction, Notification, SocialMediaPost, PromoCode, SOP } from './types';
import { SupabaseProvider } from './components/SupabaseProvider';
import { 
  useClients, useProjects, useTeamMembers, useTransactions, usePackages, useAddOns,
  useCards, useFinancialPockets, useLeads, useAssets, useContracts, useClientFeedback,
  useSocialMediaPosts, usePromoCodes, useSOPs, useNotifications, useAuth, useProfile
} from './hooks/useSupabase';
import { MOCK_TEAM_PROJECT_PAYMENTS, MOCK_TEAM_PAYMENT_RECORDS, MOCK_REWARD_LEDGER_ENTRIES, MOCK_USERS, HomeIcon, FolderKanbanIcon, UsersIcon, DollarSignIcon, PlusIcon } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Leads from './components/Leads';
import Clients from './components/Clients';
import { Projects } from './components/Projects';
import { Freelancers } from './components/Freelancers';
import Finance from './components/Finance';
import Packages from './components/Packages';
import Assets from './components/Assets';
import Settings from './components/Settings';
import { CalendarView } from './components/CalendarView';
import Login from './components/Login';
import PublicBookingForm from './components/PublicBookingForm';
import PublicFeedbackForm from './components/PublicFeedbackForm';
import PublicRevisionForm from './components/PublicRevisionForm';
import PublicLeadForm from './components/PublicLeadForm';
import Header from './components/Header';
import SuggestionForm from './components/SuggestionForm';
import ClientReports from './components/ClientKPI';
import GlobalSearch from './components/GlobalSearch';
import Contracts from './components/Contracts';
import ClientPortal from './components/ClientPortal';
import FreelancerPortal from './components/FreelancerPortal';
import SocialPlanner from './components/SocialPlanner';
import PromoCodes from './components/PromoCodes';
import SOPManagement from './components/SOP';

const AccessDenied: React.FC<{onBackToDashboard: () => void}> = ({ onBackToDashboard }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <h2 className="text-2xl font-bold text-brand-danger mb-2">Akses Ditolak</h2>
        <p className="text-brand-text-secondary mb-6">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        <button onClick={onBackToDashboard} className="button-primary">Kembali ke Dashboard</button>
    </div>
);

const BottomNavBar: React.FC<{ activeView: ViewType; handleNavigation: (view: ViewType) => void }> = ({ activeView, handleNavigation }) => {
    const navItems = [
        { view: ViewType.DASHBOARD, label: 'Beranda', icon: HomeIcon },
        { view: ViewType.PROJECTS, label: 'Proyek', icon: FolderKanbanIcon },
        { view: ViewType.CLIENTS, label: 'Klien', icon: UsersIcon },
        { view: ViewType.FINANCE, label: 'Keuangan', icon: DollarSignIcon },
    ];

    return (
        <nav className="bottom-nav xl:hidden">
            <div className="flex justify-around items-center h-16">
                {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => handleNavigation(item.view)}
                        className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${activeView === item.view ? 'text-brand-accent' : 'text-brand-text-secondary'}`}
                    >
                        <item.icon className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

const FloatingActionButton: React.FC<{ onAddClick: (type: string) => void }> = ({ onAddClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    const actions = [
        { label: 'Transaksi', type: 'transaction', icon: <DollarSignIcon className="w-5 h-5" /> },
        { label: 'Proyek', type: 'project', icon: <FolderKanbanIcon className="w-5 h-5" /> },
        { label: 'Klien', type: 'client', icon: <UsersIcon className="w-5 h-5" /> },
    ];

    return (
        <div className="fixed bottom-20 right-5 z-40 xl:hidden">
             {isOpen && (
                <div className="flex flex-col items-end gap-3 mb-3">
                    {actions.map(action => (
                         <div key={action.type} className="flex items-center gap-2">
                             <span className="text-sm font-semibold bg-brand-surface text-brand-text-primary px-3 py-1.5 rounded-lg shadow-md">{action.label}</span>
                             <button
                                onClick={() => { onAddClick(action.type); setIsOpen(false); }}
                                className="w-12 h-12 rounded-full bg-brand-surface text-brand-text-primary shadow-lg flex items-center justify-center"
                            >
                                {action.icon}
                            </button>
                         </div>
                    ))}
                </div>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-transform duration-200 ${isOpen ? 'rotate-45 bg-brand-danger' : 'bg-brand-accent'}`}
            >
                <PlusIcon className="w-8 h-8" />
            </button>
        </div>
    );
};

const AppContent: React.FC = () => {
  const { user: currentUser, loading: authLoading, signIn, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  
  // Supabase hooks for data
  const { data: clients, loading: clientsLoading, insert: insertClient, update: updateClient, remove: removeClient } = useClients();
  const { data: projects, loading: projectsLoading, insert: insertProject, update: updateProject, remove: removeProject } = useProjects();
  const { data: teamMembers, loading: teamLoading, insert: insertTeamMember, update: updateTeamMember, remove: removeTeamMember } = useTeamMembers();
  const { data: transactions, loading: transactionsLoading, insert: insertTransaction, update: updateTransaction, remove: removeTransaction } = useTransactions();
  const { data: packages, loading: packagesLoading, insert: insertPackage, update: updatePackage, remove: removePackage } = usePackages();
  const { data: addOns, loading: addOnsLoading, insert: insertAddOn, update: updateAddOn, remove: removeAddOn } = useAddOns();
  const { data: cards, loading: cardsLoading, insert: insertCard, update: updateCard, remove: removeCard } = useCards();
  const { data: pockets, loading: pocketsLoading, insert: insertPocket, update: updatePocket, remove: removePocket } = useFinancialPockets();
  const { data: leads, loading: leadsLoading, insert: insertLead, update: updateLead, remove: removeLead } = useLeads();
  const { data: assets, loading: assetsLoading, insert: insertAsset, update: updateAsset, remove: removeAsset } = useAssets();
  const { data: contracts, loading: contractsLoading, insert: insertContract, update: updateContract, remove: removeContract } = useContracts();
  const { data: clientFeedback, loading: feedbackLoading, insert: insertFeedback, update: updateFeedback, remove: removeFeedback } = useClientFeedback();
  const { data: socialMediaPosts, loading: postsLoading, insert: insertPost, update: updatePost, remove: removePost } = useSocialMediaPosts();
  const { data: promoCodes, loading: promoLoading, insert: insertPromoCode, update: updatePromoCode, remove: removePromoCode } = usePromoCodes();
  const { data: sops, loading: sopsLoading, insert: insertSOP, update: updateSOP, remove: removeSOP } = useSOPs();
  const { data: notifications, loading: notificationsLoading, insert: insertNotification, update: updateNotification, remove: removeNotification } = useNotifications();

  // Local state for UI
  const [activeView, setActiveView] = useState<ViewType>(ViewType.DASHBOARD);
  const [notification, setNotification] = useState<string>('');
  const [initialAction, setInitialAction] = useState<NavigationAction | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [route, setRoute] = useState(window.location.hash);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Mock data for features not yet migrated to Supabase
  const [teamProjectPayments, setTeamProjectPayments] = useState<TeamProjectPayment[]>(() => JSON.parse(JSON.stringify(MOCK_TEAM_PROJECT_PAYMENTS)));
  const [teamPaymentRecords, setTeamPaymentRecords] = useState<TeamPaymentRecord[]>(() => JSON.parse(JSON.stringify(MOCK_TEAM_PAYMENT_RECORDS)));
  const [rewardLedgerEntries, setRewardLedgerEntries] = useState<RewardLedgerEntry[]>(() => JSON.parse(JSON.stringify(MOCK_REWARD_LEDGER_ENTRIES)));
  const [users, setUsers] = useState<User[]>(() => JSON.parse(JSON.stringify(MOCK_USERS)));

  useEffect(() => {
    const handleHashChange = () => {
        setRoute(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showNotification = (message: string, duration: number = 3000) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, duration);
  };

  const handleLoginSuccess = async (email: string, password: string) => {
    const { user, error } = await signIn(email, password);
    if (error) {
      throw new Error(error);
    } else if (user) {
      setActiveView(ViewType.DASHBOARD);
      showNotification('Login berhasil!');
    }
  };

  const handleLogout = async () => {
    await signOut();
    showNotification('Logout berhasil!');
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await updateNotification(notificationId, { isRead: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(unreadNotifications.map(n => updateNotification(n.id, { isRead: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNavigation = (view: ViewType, action?: NavigationAction, notificationId?: string) => {
    setActiveView(view);
    setInitialAction(action || null);
    setIsSidebarOpen(false);
    setIsSearchOpen(false);
    if (notificationId) {
        handleMarkAsRead(notificationId);
    }
  };

  const handleUpdateRevision = async (projectId: string, revisionId: string, updatedData: { freelancerNotes: string, driveLink: string, status: RevisionStatus }) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedRevisions = (project.revisions || []).map(r => {
      if (r.id === revisionId) {
        return { 
          ...r, 
          freelancerNotes: updatedData.freelancerNotes,
          driveLink: updatedData.driveLink,
          status: updatedData.status,
          completedDate: updatedData.status === RevisionStatus.COMPLETED ? new Date().toISOString() : r.completedDate,
        };
      }
      return r;
    });

    await updateProject(projectId, { revisions: updatedRevisions });
    showNotification("Update revisi telah berhasil dikirim.");
  };

  const handleClientConfirmation = async (projectId: string, stage: 'editing' | 'printing' | 'delivery') => {
    const updates: Partial<Project> = {};
    if (stage === 'editing') updates.isEditingConfirmedByClient = true;
    if (stage === 'printing') updates.isPrintingConfirmedByClient = true;
    if (stage === 'delivery') updates.isDeliveryConfirmedByClient = true;

    await updateProject(projectId, updates);
    showNotification("Konfirmasi telah diterima. Terima kasih!");
  };
    
  const handleClientSubStatusConfirmation = async (projectId: string, subStatusName: string, note: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const confirmed = [...(project.confirmedSubStatuses || []), subStatusName];
    const notes = { ...(project.clientSubStatusNotes || {}), [subStatusName]: note };
    
    await updateProject(projectId, { 
      confirmedSubStatuses: confirmed, 
      clientSubStatusNotes: notes 
    });

    const newNotification: Notification = {
      id: `NOTIF-NOTE-${Date.now()}`,
      title: 'Catatan Klien Baru',
      message: `Klien ${project.clientName} memberikan catatan pada sub-status "${subStatusName}" di proyek "${project.projectName}".`,
      timestamp: new Date().toISOString(),
      isRead: false,
      icon: 'comment',
      linkView: ViewType.PROJECTS,
      linkAction: { type: 'VIEW_PROJECT_DETAILS', id: projectId }
    };
    
    await insertNotification(newNotification);
    showNotification(`Konfirmasi untuk "${subStatusName}" telah diterima.`);
  };
    
  const handleSignContract = async (contractId: string, signatureDataUrl: string, signer: 'vendor' | 'client') => {
    const updates = signer === 'vendor' 
      ? { vendorSignature: signatureDataUrl }
      : { clientSignature: signatureDataUrl };
    
    await updateContract(contractId, updates);
    showNotification('Tanda tangan berhasil disimpan.');
  };
    
  const handleSignInvoice = async (projectId: string, signatureDataUrl: string) => {
    await updateProject(projectId, { invoiceSignature: signatureDataUrl });
    showNotification('Invoice berhasil ditandatangani.');
  };
    
  const handleSignTransaction = async (transactionId: string, signatureDataUrl: string) => {
    await updateTransaction(transactionId, { vendorSignature: signatureDataUrl });
    showNotification('Kuitansi berhasil ditandatangani.');
  };
    
  const handleSignPaymentRecord = (recordId: string, signatureDataUrl: string) => {
    setTeamPaymentRecords(prev => prev.map(r => r.id === recordId ? { ...r, vendorSignature: signatureDataUrl } : r));
    showNotification('Slip pembayaran berhasil ditandatangani.');
  };

  const hasPermission = (view: ViewType) => {
    if (!currentUser) return false;
    if (currentUser.role === 'Admin') return true;
    if (view === ViewType.DASHBOARD) return true;
    return currentUser.permissions?.includes(view) || false;
  };

  // Show loading screen while data is being fetched
  const isLoading = authLoading || profileLoading || clientsLoading || projectsLoading || 
    teamLoading || transactionsLoading || packagesLoading || addOnsLoading || 
    cardsLoading || pocketsLoading || leadsLoading || assetsLoading || 
    contractsLoading || feedbackLoading || postsLoading || promoLoading || 
    sopsLoading || notificationsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mx-auto mb-4"></div>
          <p className="text-brand-text-secondary">Memuat data dari Supabase...</p>
        </div>
      </div>
    );
  }

  // Helper function to create async state setters for Supabase integration
  const createAsyncSetter = <T extends { id: string }>(
    data: T[],
    insertFn: (item: Omit<T, 'id'>) => Promise<T>,
    updateFn: (id: string, updates: Partial<T>) => Promise<T>,
    removeFn?: (id: string) => Promise<void>
  ) => {
    return async (updater: React.SetStateAction<T[]>) => {
      if (typeof updater === 'function') {
        const newData = updater(data);
        
        // Find new items (items that don't exist in current data)
        const newItems = newData.filter(newItem => !data.find(existing => existing.id === newItem.id));
        
        // Find updated items (items that exist but have changed)
        const updatedItems = newData.filter(newItem => {
          const existing = data.find(e => e.id === newItem.id);
          return existing && JSON.stringify(existing) !== JSON.stringify(newItem);
        });
        
        // Find removed items (items that exist in current data but not in new data)
        const removedItems = data.filter(existing => !newData.find(newItem => newItem.id === existing.id));

        try {
          // Insert new items
          for (const item of newItems) {
            const { id, ...itemWithoutId } = item;
            await insertFn(itemWithoutId);
          }

          // Update changed items
          for (const item of updatedItems) {
            const { id, ...updates } = item;
            await updateFn(id, updates);
          }

          // Remove deleted items
          if (removeFn) {
            for (const item of removedItems) {
              await removeFn(item.id);
            }
          }
        } catch (error) {
          console.error('Error syncing data with Supabase:', error);
          showNotification('Terjadi kesalahan saat menyimpan data');
        }
      }
    };
  };
  
  const renderView = () => {
    if (!hasPermission(activeView)) {
        return <AccessDenied onBackToDashboard={() => setActiveView(ViewType.DASHBOARD)} />;
    }
    switch (activeView) {
      case ViewType.DASHBOARD:
        return <Dashboard 
          projects={projects} 
          clients={clients} 
          transactions={transactions} 
          teamMembers={teamMembers}
          cards={cards}
          pockets={pockets}
          handleNavigation={handleNavigation}
          leads={leads}
          teamProjectPayments={teamProjectPayments}
          packages={packages}
          assets={assets}
          clientFeedback={clientFeedback}
          contracts={contracts}
          currentUser={currentUser}
          projectStatusConfig={profile?.projectStatusConfig || []}
        />;
      case ViewType.PROSPEK:
        return <Leads
            leads={leads} 
            setLeads={createAsyncSetter(leads, insertLead, updateLead, removeLead)}
            clients={clients} 
            setClients={createAsyncSetter(clients, insertClient, updateClient, removeClient)}
            projects={projects} 
            setProjects={createAsyncSetter(projects, insertProject, updateProject, removeProject)}
            packages={packages} addOns={addOns}
            transactions={transactions} 
            setTransactions={createAsyncSetter(transactions, insertTransaction, updateTransaction, removeTransaction)}
            userProfile={profile!} showNotification={showNotification}
            cards={cards} 
            setCards={createAsyncSetter(cards, insertCard, updateCard, removeCard)}
            pockets={pockets} 
            setPockets={createAsyncSetter(pockets, insertPocket, updatePocket, removePocket)}
            promoCodes={promoCodes} 
            setPromoCodes={createAsyncSetter(promoCodes, insertPromoCode, updatePromoCode, removePromoCode)}
        />;
      case ViewType.CLIENTS:
        return <Clients
          clients={clients} 
          setClients={createAsyncSetter(clients, insertClient, updateClient, removeClient)}
          projects={projects} 
          setProjects={createAsyncSetter(projects, insertProject, updateProject, removeProject)}
          packages={packages} addOns={addOns}
          transactions={transactions} 
          setTransactions={createAsyncSetter(transactions, insertTransaction, updateTransaction, removeTransaction)}
          userProfile={profile!}
          showNotification={showNotification}
          initialAction={initialAction} setInitialAction={setInitialAction}
          cards={cards} 
          setCards={createAsyncSetter(cards, insertCard, updateCard, removeCard)}
          pockets={pockets} 
          setPockets={createAsyncSetter(pockets, insertPocket, updatePocket, removePocket)}
          contracts={contracts}
          handleNavigation={handleNavigation}
          clientFeedback={clientFeedback}
          promoCodes={promoCodes} 
          setPromoCodes={createAsyncSetter(promoCodes, insertPromoCode, updatePromoCode, removePromoCode)}
          onSignInvoice={handleSignInvoice}
          onSignTransaction={handleSignTransaction}
        />;
      case ViewType.PROJECTS:
        return <Projects 
          projects={projects} 
          setProjects={createAsyncSetter(projects, insertProject, updateProject, removeProject)}
          clients={clients}
          packages={packages}
          teamMembers={teamMembers}
          teamProjectPayments={teamProjectPayments} setTeamProjectPayments={setTeamProjectPayments}
          transactions={transactions} 
          setTransactions={createAsyncSetter(transactions, insertTransaction, updateTransaction, removeTransaction)}
          initialAction={initialAction} setInitialAction={setInitialAction}
          profile={profile!}
          showNotification={showNotification}
          cards={cards}
          setCards={createAsyncSetter(cards, insertCard, updateCard, removeCard)}
        />;
      case ViewType.TEAM:
        return (
          <Freelancers
            teamMembers={teamMembers}
            setTeamMembers={createAsyncSetter(teamMembers, insertTeamMember, updateTeamMember, removeTeamMember)}
            teamProjectPayments={teamProjectPayments}
            setTeamProjectPayments={setTeamProjectPayments}
            teamPaymentRecords={teamPaymentRecords}
            setTeamPaymentRecords={setTeamPaymentRecords}
            transactions={transactions}
            setTransactions={createAsyncSetter(transactions, insertTransaction, updateTransaction, removeTransaction)}
            userProfile={profile!}
            showNotification={showNotification}
            initialAction={initialAction}
            setInitialAction={setInitialAction}
            projects={projects}
            setProjects={createAsyncSetter(projects, insertProject, updateProject, removeProject)}
            rewardLedgerEntries={rewardLedgerEntries}
            setRewardLedgerEntries={setRewardLedgerEntries}
            pockets={pockets}
            setPockets={createAsyncSetter(pockets, insertPocket, updatePocket, removePocket)}
            cards={cards}
            setCards={createAsyncSetter(cards, insertCard, updateCard, removeCard)}
            onSignPaymentRecord={handleSignPaymentRecord}
          />
        );
      case ViewType.FINANCE:
        return <Finance 
          transactions={transactions} 
          setTransactions={createAsyncSetter(transactions, insertTransaction, updateTransaction, removeTransaction)}
          pockets={pockets} 
          setPockets={createAsyncSetter(pockets, insertPocket, updatePocket, removePocket)}
          projects={projects}
          profile={profile!}
          cards={cards} 
          setCards={createAsyncSetter(cards, insertCard, updateCard, removeCard)}
          teamMembers={teamMembers}
          rewardLedgerEntries={rewardLedgerEntries}
        />;
      case ViewType.PACKAGES:
        return <Packages 
          packages={packages} 
          setPackages={createAsyncSetter(packages, insertPackage, updatePackage, removePackage)}
          addOns={addOns} 
          setAddOns={createAsyncSetter(addOns, insertAddOn, updateAddOn, removeAddOn)}
          projects={projects} 
        />;
      case ViewType.ASSETS:
        return <Assets 
          assets={assets} 
          setAssets={createAsyncSetter(assets, insertAsset, updateAsset, removeAsset)}
          profile={profile!} 
          showNotification={showNotification} 
        />;
      case ViewType.CONTRACTS:
        return <Contracts 
            contracts={contracts} 
            setContracts={createAsyncSetter(contracts, insertContract, updateContract, removeContract)}
            clients={clients} projects={projects} profile={profile!}
            showNotification={showNotification}
            initialAction={initialAction} setInitialAction={setInitialAction}
            packages={packages}
            onSignContract={handleSignContract}
        />;
      case ViewType.SOP:
        return <SOPManagement 
          sops={sops} 
          setSops={createAsyncSetter(sops, insertSOP, updateSOP, removeSOP)}
          profile={profile!} 
          showNotification={showNotification} 
        />;
      case ViewType.SETTINGS:
        return <Settings 
          profile={profile!} 
          setProfile={updateProfile}
          transactions={transactions} projects={projects}
          users={users} setUsers={setUsers}
          currentUser={currentUser}
        />;
      case ViewType.CALENDAR:
        return <CalendarView 
          projects={projects} 
          setProjects={createAsyncSetter(projects, insertProject, updateProject, removeProject)}
          teamMembers={teamMembers} 
          profile={profile!} 
        />;
      case ViewType.CLIENT_REPORTS:
        return <ClientReports 
            clients={clients}
            leads={leads}
            projects={projects}
            feedback={clientFeedback}
            setFeedback={createAsyncSetter(clientFeedback, insertFeedback, updateFeedback, removeFeedback)}
            showNotification={showNotification}
        />;
      case ViewType.SOCIAL_MEDIA_PLANNER:
        return <SocialPlanner 
          posts={socialMediaPosts} 
          setPosts={createAsyncSetter(socialMediaPosts, insertPost, updatePost, removePost)}
          projects={projects} 
          showNotification={showNotification} 
        />;
      case ViewType.PROMO_CODES:
        return <PromoCodes 
          promoCodes={promoCodes} 
          setPromoCodes={createAsyncSetter(promoCodes, insertPromoCode, updatePromoCode, removePromoCode)}
          projects={projects} 
          showNotification={showNotification} 
        />;
      default:
        return <Dashboard 
          projects={projects} 
          clients={clients} 
          transactions={transactions} 
          teamMembers={teamMembers}
          cards={cards}
          pockets={pockets}
          handleNavigation={handleNavigation}
          leads={leads}
          teamProjectPayments={teamProjectPayments}
          packages={packages}
          assets={assets}
          clientFeedback={clientFeedback}
          contracts={contracts}
          currentUser={currentUser}
          projectStatusConfig={profile?.projectStatusConfig || []}
        />;
    }
  };
  
  // ROUTING FOR PUBLIC PAGES
  if (route.startsWith('#/public-booking')) {
    return <PublicBookingForm 
        setClients={createAsyncSetter(clients, insertClient, updateClient)}
        setProjects={createAsyncSetter(projects, insertProject, updateProject)}
        packages={packages}
        addOns={addOns}
        setTransactions={createAsyncSetter(transactions, insertTransaction, updateTransaction)}
        userProfile={profile!}
        cards={cards}
        setCards={createAsyncSetter(cards, insertCard, updateCard)}
        pockets={pockets}
        setPockets={createAsyncSetter(pockets, insertPocket, updatePocket)}
        promoCodes={promoCodes}
        setPromoCodes={createAsyncSetter(promoCodes, insertPromoCode, updatePromoCode)}
        showNotification={showNotification}
        setLeads={createAsyncSetter(leads, insertLead, updateLead)}
    />;
  }
  if (route.startsWith('#/public-lead-form')) {
    return <PublicLeadForm 
        setLeads={createAsyncSetter(leads, insertLead, updateLead)}
        userProfile={profile!}
        showNotification={showNotification}
    />;
  }
  if (route.startsWith('#/feedback')) {
    return <PublicFeedbackForm 
      setClientFeedback={createAsyncSetter(clientFeedback, insertFeedback, updateFeedback)}
    />;
  }
  if (route.startsWith('#/suggestion-form')) {
    return <SuggestionForm 
      setLeads={createAsyncSetter(leads, insertLead, updateLead)}
    />;
  }
  if (route.startsWith('#/revision-form')) {
    return <PublicRevisionForm projects={projects} teamMembers={teamMembers} onUpdateRevision={handleUpdateRevision} />;
  }
  if (route.startsWith('#/portal/')) {
    const accessId = route.split('/portal/')[1];
    return <ClientPortal 
        accessId={accessId} 
        clients={clients} 
        projects={projects} 
        setClientFeedback={createAsyncSetter(clientFeedback, insertFeedback, updateFeedback)}
        showNotification={showNotification} 
        contracts={contracts} 
        transactions={transactions}
        profile={profile!}
        packages={packages}
        onClientConfirmation={handleClientConfirmation}
        onClientSubStatusConfirmation={handleClientSubStatusConfirmation}
        onSignContract={handleSignContract}
    />;
  }
  if (route.startsWith('#/freelancer-portal/')) {
    const accessId = route.split('/freelancer-portal/')[1];
    return <FreelancerPortal 
        accessId={accessId} 
        teamMembers={teamMembers} 
        projects={projects} 
        teamProjectPayments={teamProjectPayments}
        teamPaymentRecords={teamPaymentRecords}
        rewardLedgerEntries={rewardLedgerEntries}
        showNotification={showNotification}
        onUpdateRevision={handleUpdateRevision}
        sops={sops}
        profile={profile!}
    />;
  }
  
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} users={users} />;
  }

  return (
    <div className="flex h-screen bg-brand-bg text-brand-text-primary">
      <Sidebar 
        activeView={activeView} 
        setActiveView={(view) => handleNavigation(view)} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
        currentUser={currentUser}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            pageTitle={activeView} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            setIsSearchOpen={setIsSearchOpen}
            notifications={notifications}
            handleNavigation={handleNavigation}
            handleMarkAllAsRead={handleMarkAllAsRead}
            currentUser={currentUser}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 xl:pb-8">
            {renderView()}
        </main>
      </div>
      {notification && (
        <div className="fixed top-5 right-5 bg-brand-accent text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {notification}
        </div>
      )}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        clients={clients}
        projects={projects}
        teamMembers={teamMembers}
        handleNavigation={handleNavigation}
      />
      <BottomNavBar activeView={activeView} handleNavigation={handleNavigation} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SupabaseProvider>
      <AppContent />
    </SupabaseProvider>
  );
};

export default App;