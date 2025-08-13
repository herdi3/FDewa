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
      showNotification(error);
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

  const handleUpdateRevision = (projectId: string, revisionId: string, updatedData: { freelancerNotes: string, driveLink: string, status: RevisionStatus }) => {
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

    updateProject(projectId, { revisions: updatedRevisions });
    showNotification("Update revisi telah berhasil dikirim.");
  };

  const handleClientConfirmation = (projectId: string, stage: 'editing' | 'printing' | 'delivery') => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updates: Partial<Project> = {};
    if (stage === 'editing') updates.isEditingConfirmedByClient = true;
    if (stage === 'printing') updates.isPrintingConfirmedByClient = true;
    if (stage === 'delivery') updates.isDeliveryConfirmedByClient = true;

    updateProject(projectId, updates);
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
          <p className="text-brand-text-secondary">Memuat data...</p>
        </div>
      </div>
    );
  }
  
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
            setLeads={async (updater) => {
              if (typeof updater === 'function') {
                const newLeads = updater(leads);
                // Handle array updates by comparing and applying changes
                for (const lead of newLeads) {
                  const existing = leads.find(l => l.id === lead.id);
                  if (!existing) {
                    await insertLead(lead);
                  } else if (JSON.stringify(existing) !== JSON.stringify(lead)) {
                    await updateLead(lead.id, lead);
                  }
                }
              }
            }}
            clients={clients} 
            setClients={async (updater) => {
              if (typeof updater === 'function') {
                const newClients = updater(clients);
                for (const client of newClients) {
                  const existing = clients.find(c => c.id === client.id);
                  if (!existing) {
                    await insertClient(client);
                  }
                }
              }
            }}
            projects={projects} 
            setProjects={async (updater) => {
              if (typeof updater === 'function') {
                const newProjects = updater(projects);
                for (const project of newProjects) {
                  const existing = projects.find(p => p.id === project.id);
                  if (!existing) {
                    await insertProject(project);
                  }
                }
              }
            }}
            packages={packages} addOns={addOns}
            transactions={transactions} 
            setTransactions={async (updater) => {
              if (typeof updater === 'function') {
                const newTransactions = updater(transactions);
                for (const transaction of newTransactions) {
                  const existing = transactions.find(t => t.id === transaction.id);
                  if (!existing) {
                    await insertTransaction(transaction);
                  }
                }
              }
            }}
            userProfile={profile!} showNotification={showNotification}
            cards={cards} 
            setCards={async (updater) => {
              if (typeof updater === 'function') {
                const newCards = updater(cards);
                for (const card of newCards) {
                  const existing = cards.find(c => c.id === card.id);
                  if (existing && JSON.stringify(existing) !== JSON.stringify(card)) {
                    await updateCard(card.id, card);
                  }
                }
              }
            }}
            pockets={pockets} 
            setPockets={async (updater) => {
              if (typeof updater === 'function') {
                const newPockets = updater(pockets);
                for (const pocket of newPockets) {
                  const existing = pockets.find(p => p.id === pocket.id);
                  if (existing && JSON.stringify(existing) !== JSON.stringify(pocket)) {
                    await updatePocket(pocket.id, pocket);
                  }
                }
              }
            }}
            promoCodes={promoCodes} 
            setPromoCodes={async (updater) => {
              if (typeof updater === 'function') {
                const newPromoCodes = updater(promoCodes);
                for (const promo of newPromoCodes) {
                  const existing = promoCodes.find(p => p.id === promo.id);
                  if (existing && JSON.stringify(existing) !== JSON.stringify(promo)) {
                    await updatePromoCode(promo.id, promo);
                  }
                }
              }
            }}
        />;
      case ViewType.CLIENTS:
        return <Clients
          clients={clients} 
          setClients={async (updater) => {
            if (typeof updater === 'function') {
              const newClients = updater(clients);
              for (const client of newClients) {
                const existing = clients.find(c => c.id === client.id);
                if (!existing) {
                  await insertClient(client);
                } else if (JSON.stringify(existing) !== JSON.stringify(client)) {
                  await updateClient(client.id, client);
                }
              }
            }
          }}
          projects={projects} 
          setProjects={async (updater) => {
            if (typeof updater === 'function') {
              const newProjects = updater(projects);
              for (const project of newProjects) {
                const existing = projects.find(p => p.id === project.id);
                if (!existing) {
                  await insertProject(project);
                } else if (JSON.stringify(existing) !== JSON.stringify(project)) {
                  await updateProject(project.id, project);
                }
              }
            }
          }}
          packages={packages} addOns={addOns}
          transactions={transactions} 
          setTransactions={async (updater) => {
            if (typeof updater === 'function') {
              const newTransactions = updater(transactions);
              for (const transaction of newTransactions) {
                const existing = transactions.find(t => t.id === transaction.id);
                if (!existing) {
                  await insertTransaction(transaction);
                }
              }
            }
          }}
          userProfile={profile!}
          showNotification={showNotification}
          initialAction={initialAction} setInitialAction={setInitialAction}
          cards={cards} 
          setCards={async (updater) => {
            if (typeof updater === 'function') {
              const newCards = updater(cards);
              for (const card of newCards) {
                const existing = cards.find(c => c.id === card.id);
                if (existing && JSON.stringify(existing) !== JSON.stringify(card)) {
                  await updateCard(card.id, card);
                }
              }
            }
          }}
          pockets={pockets} 
          setPockets={async (updater) => {
            if (typeof updater === 'function') {
              const newPockets = updater(pockets);
              for (const pocket of newPockets) {
                const existing = pockets.find(p => p.id === pocket.id);
                if (existing && JSON.stringify(existing) !== JSON.stringify(pocket)) {
                  await updatePocket(pocket.id, pocket);
                }
              }
            }
          }}
          contracts={contracts}
          handleNavigation={handleNavigation}
          clientFeedback={clientFeedback}
          promoCodes={promoCodes} 
          setPromoCodes={async (updater) => {
            if (typeof updater === 'function') {
              const newPromoCodes = updater(promoCodes);
              for (const promo of newPromoCodes) {
                const existing = promoCodes.find(p => p.id === promo.id);
                if (existing && JSON.stringify(existing) !== JSON.stringify(promo)) {
                  await updatePromoCode(promo.id, promo);
                }
              }
            }
          }}
          onSignInvoice={handleSignInvoice}
          onSignTransaction={handleSignTransaction}
        />;
      case ViewType.PROJECTS:
        return <Projects 
          projects={projects} 
          setProjects={async (updater) => {
            if (typeof updater === 'function') {
              const newProjects = updater(projects);
              for (const project of newProjects) {
                const existing = projects.find(p => p.id === project.id);
                if (!existing) {
                  await insertProject(project);
                } else if (JSON.stringify(existing) !== JSON.stringify(project)) {
                  await updateProject(project.id, project);
                }
              }
            }
          }}
          clients={clients}
          packages={packages}
          teamMembers={teamMembers}
          teamProjectPayments={teamProjectPayments} setTeamProjectPayments={setTeamProjectPayments}
          transactions={transactions} 
          setTransactions={async (updater) => {
            if (typeof updater === 'function') {
              const newTransactions = updater(transactions);
              for (const transaction of newTransactions) {
                const existing = transactions.find(t => t.id === transaction.id);
                if (!existing) {
                  await insertTransaction(transaction);
                }
              }
            }
          }}
          initialAction={initialAction} setInitialAction={setInitialAction}
          profile={profile!}
          showNotification={showNotification}
          cards={cards}
          setCards={async (updater) => {
            if (typeof updater === 'function') {
              const newCards = updater(cards);
              for (const card of newCards) {
                const existing = cards.find(c => c.id === card.id);
                if (existing && JSON.stringify(existing) !== JSON.stringify(card)) {
                  await updateCard(card.id, card);
                }
              }
            }
          }}
        />;
      case ViewType.TEAM:
        return (
          <Freelancers
            teamMembers={teamMembers}
            setTeamMembers={async (updater) => {
              if (typeof updater === 'function') {
                const newTeamMembers = updater(teamMembers);
                for (const member of newTeamMembers) {
                  const existing = teamMembers.find(m => m.id === member.id);
                  if (!existing) {
                    await insertTeamMember(member);
                  } else if (JSON.stringify(existing) !== JSON.stringify(member)) {
                    await updateTeamMember(member.id, member);
                  }
                }
              }
            }}
            teamProjectPayments={teamProjectPayments}
            setTeamProjectPayments={setTeamProjectPayments}
            teamPaymentRecords={teamPaymentRecords}
            setTeamPaymentRecords={setTeamPaymentRecords}
            transactions={transactions}
            setTransactions={async (updater) => {
              if (typeof updater === 'function') {
                const newTransactions = updater(transactions);
                for (const transaction of newTransactions) {
                  const existing = transactions.find(t => t.id === transaction.id);
                  if (!existing) {
                    await insertTransaction(transaction);
                  }
                }
              }
            }}
            userProfile={profile!}
            showNotification={showNotification}
            initialAction={initialAction}
            setInitialAction={setInitialAction}
            projects={projects}
            setProjects={async (updater) => {
              if (typeof updater === 'function') {
                const newProjects = updater(projects);
                for (const project of newProjects) {
                  const existing = projects.find(p => p.id === project.id);
                  if (existing && JSON.stringify(existing) !== JSON.stringify(project)) {
                    await updateProject(project.id, project);
                  }
                }
              }
            }}
            rewardLedgerEntries={rewardLedgerEntries}
            setRewardLedgerEntries={setRewardLedgerEntries}
            pockets={pockets}
            setPockets={async (updater) => {
              if (typeof updater === 'function') {
                const newPockets = updater(pockets);
                for (const pocket of newPockets) {
                  const existing = pockets.find(p => p.id === pocket.id);
                  if (existing && JSON.stringify(existing) !== JSON.stringify(pocket)) {
                    await updatePocket(pocket.id, pocket);
                  }
                }
              }
            }}
            cards={cards}
            setCards={async (updater) => {
              if (typeof updater === 'function') {
                const newCards = updater(cards);
                for (const card of newCards) {
                  const existing = cards.find(c => c.id === card.id);
                  if (existing && JSON.stringify(existing) !== JSON.stringify(card)) {
                    await updateCard(card.id, card);
                  }
                }
              }
            }}
            onSignPaymentRecord={handleSignPaymentRecord}
          />
        );
      case ViewType.FINANCE:
        return <Finance 
          transactions={transactions} 
          setTransactions={async (updater) => {
            if (typeof updater === 'function') {
              const newTransactions = updater(transactions);
              for (const transaction of newTransactions) {
                const existing = transactions.find(t => t.id === transaction.id);
                if (!existing) {
                  await insertTransaction(transaction);
                } else if (JSON.stringify(existing) !== JSON.stringify(transaction)) {
                  await updateTransaction(transaction.id, transaction);
                }
              }
            }
          }}
          pockets={pockets} 
          setPockets={async (updater) => {
            if (typeof updater === 'function') {
              const newPockets = updater(pockets);
              for (const pocket of newPockets) {
                const existing = pockets.find(p => p.id === pocket.id);
                if (!existing) {
                  await insertPocket(pocket);
                } else if (JSON.stringify(existing) !== JSON.stringify(pocket)) {
                  await updatePocket(pocket.id, pocket);
                }
              }
            }
          }}
          projects={projects}
          profile={profile!}
          cards={cards} 
          setCards={async (updater) => {
            if (typeof updater === 'function') {
              const newCards = updater(cards);
              for (const card of newCards) {
                const existing = cards.find(c => c.id === card.id);
                if (!existing) {
                  await insertCard(card);
                } else if (JSON.stringify(existing) !== JSON.stringify(card)) {
                  await updateCard(card.id, card);
                }
              }
            }
          }}
          teamMembers={teamMembers}
          rewardLedgerEntries={rewardLedgerEntries}
        />;
      case ViewType.PACKAGES:
        return <Packages 
          packages={packages} 
          setPackages={async (updater) => {
            if (typeof updater === 'function') {
              const newPackages = updater(packages);
              for (const pkg of newPackages) {
                const existing = packages.find(p => p.id === pkg.id);
                if (!existing) {
                  await insertPackage(pkg);
                } else if (JSON.stringify(existing) !== JSON.stringify(pkg)) {
                  await updatePackage(pkg.id, pkg);
                }
              }
            }
          }}
          addOns={addOns} 
          setAddOns={async (updater) => {
            if (typeof updater === 'function') {
              const newAddOns = updater(addOns);
              for (const addOn of newAddOns) {
                const existing = addOns.find(a => a.id === addOn.id);
                if (!existing) {
                  await insertAddOn(addOn);
                } else if (JSON.stringify(existing) !== JSON.stringify(addOn)) {
                  await updateAddOn(addOn.id, addOn);
                }
              }
            }
          }}
          projects={projects} 
        />;
      case ViewType.ASSETS:
        return <Assets 
          assets={assets} 
          setAssets={async (updater) => {
            if (typeof updater === 'function') {
              const newAssets = updater(assets);
              for (const asset of newAssets) {
                const existing = assets.find(a => a.id === asset.id);
                if (!existing) {
                  await insertAsset(asset);
                } else if (JSON.stringify(existing) !== JSON.stringify(asset)) {
                  await updateAsset(asset.id, asset);
                }
              }
            }
          }}
          profile={profile!} 
          showNotification={showNotification} 
        />;
      case ViewType.CONTRACTS:
        return <Contracts 
            contracts={contracts} 
            setContracts={async (updater) => {
              if (typeof updater === 'function') {
                const newContracts = updater(contracts);
                for (const contract of newContracts) {
                  const existing = contracts.find(c => c.id === contract.id);
                  if (!existing) {
                    await insertContract(contract);
                  } else if (JSON.stringify(existing) !== JSON.stringify(contract)) {
                    await updateContract(contract.id, contract);
                  }
                }
              }
            }}
            clients={clients} projects={projects} profile={profile!}
            showNotification={showNotification}
            initialAction={initialAction} setInitialAction={setInitialAction}
            packages={packages}
            onSignContract={handleSignContract}
        />;
      case ViewType.SOP:
        return <SOPManagement 
          sops={sops} 
          setSops={async (updater) => {
            if (typeof updater === 'function') {
              const newSOPs = updater(sops);
              for (const sop of newSOPs) {
                const existing = sops.find(s => s.id === sop.id);
                if (!existing) {
                  await insertSOP(sop);
                } else if (JSON.stringify(existing) !== JSON.stringify(sop)) {
                  await updateSOP(sop.id, sop);
                }
              }
            }
          }}
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
          setProjects={async (updater) => {
            if (typeof updater === 'function') {
              const newProjects = updater(projects);
              for (const project of newProjects) {
                const existing = projects.find(p => p.id === project.id);
                if (!existing) {
                  await insertProject(project);
                } else if (JSON.stringify(existing) !== JSON.stringify(project)) {
                  await updateProject(project.id, project);
                }
              }
            }
          }}
          teamMembers={teamMembers} 
          profile={profile!} 
        />;
      case ViewType.CLIENT_REPORTS:
        return <ClientReports 
            clients={clients}
            leads={leads}
            projects={projects}
            feedback={clientFeedback}
            setFeedback={async (updater) => {
              if (typeof updater === 'function') {
                const newFeedback = updater(clientFeedback);
                for (const feedback of newFeedback) {
                  const existing = clientFeedback.find(f => f.id === feedback.id);
                  if (!existing) {
                    await insertFeedback(feedback);
                  }
                }
              }
            }}
            showNotification={showNotification}
        />;
      case ViewType.SOCIAL_MEDIA_PLANNER:
        return <SocialPlanner 
          posts={socialMediaPosts} 
          setPosts={async (updater) => {
            if (typeof updater === 'function') {
              const newPosts = updater(socialMediaPosts);
              for (const post of newPosts) {
                const existing = socialMediaPosts.find(p => p.id === post.id);
                if (!existing) {
                  await insertPost(post);
                } else if (JSON.stringify(existing) !== JSON.stringify(post)) {
                  await updatePost(post.id, post);
                }
              }
            }
          }}
          projects={projects} 
          showNotification={showNotification} 
        />;
      case ViewType.PROMO_CODES:
        return <PromoCodes 
          promoCodes={promoCodes} 
          setPromoCodes={async (updater) => {
            if (typeof updater === 'function') {
              const newPromoCodes = updater(promoCodes);
              for (const promo of newPromoCodes) {
                const existing = promoCodes.find(p => p.id === promo.id);
                if (!existing) {
                  await insertPromoCode(promo);
                } else if (JSON.stringify(existing) !== JSON.stringify(promo)) {
                  await updatePromoCode(promo.id, promo);
                }
              }
            }
          }}
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
        setClients={async (updater) => {
          if (typeof updater === 'function') {
            const newClients = updater(clients);
            for (const client of newClients) {
              const existing = clients.find(c => c.id === client.id);
              if (!existing) {
                await insertClient(client);
              }
            }
          }
        }}
        setProjects={async (updater) => {
          if (typeof updater === 'function') {
            const newProjects = updater(projects);
            for (const project of newProjects) {
              const existing = projects.find(p => p.id === project.id);
              if (!existing) {
                await insertProject(project);
              }
            }
          }
        }}
        packages={packages}
        addOns={addOns}
        setTransactions={async (updater) => {
          if (typeof updater === 'function') {
            const newTransactions = updater(transactions);
            for (const transaction of newTransactions) {
              const existing = transactions.find(t => t.id === transaction.id);
              if (!existing) {
                await insertTransaction(transaction);
              }
            }
          }
        }}
        userProfile={profile!}
        cards={cards}
        setCards={async (updater) => {
          if (typeof updater === 'function') {
            const newCards = updater(cards);
            for (const card of newCards) {
              const existing = cards.find(c => c.id === card.id);
              if (existing && JSON.stringify(existing) !== JSON.stringify(card)) {
                await updateCard(card.id, card);
              }
            }
          }
        }}
        pockets={pockets}
        setPockets={async (updater) => {
          if (typeof updater === 'function') {
            const newPockets = updater(pockets);
            for (const pocket of newPockets) {
              const existing = pockets.find(p => p.id === pocket.id);
              if (existing && JSON.stringify(existing) !== JSON.stringify(pocket)) {
                await updatePocket(pocket.id, pocket);
              }
            }
          }
        }}
        promoCodes={promoCodes}
        setPromoCodes={async (updater) => {
          if (typeof updater === 'function') {
            const newPromoCodes = updater(promoCodes);
            for (const promo of newPromoCodes) {
              const existing = promoCodes.find(p => p.id === promo.id);
              if (existing && JSON.stringify(existing) !== JSON.stringify(promo)) {
                await updatePromoCode(promo.id, promo);
              }
            }
          }
        }}
        showNotification={showNotification}
        setLeads={async (updater) => {
          if (typeof updater === 'function') {
            const newLeads = updater(leads);
            for (const lead of newLeads) {
              const existing = leads.find(l => l.id === lead.id);
              if (!existing) {
                await insertLead(lead);
              }
            }
          }
        }}
    />;
  }
  if (route.startsWith('#/public-lead-form')) {
    return <PublicLeadForm 
        setLeads={async (updater) => {
          if (typeof updater === 'function') {
            const newLeads = updater(leads);
            for (const lead of newLeads) {
              const existing = leads.find(l => l.id === lead.id);
              if (!existing) {
                await insertLead(lead);
              }
            }
          }
        }}
        userProfile={profile!}
        showNotification={showNotification}
    />;
  }
  if (route.startsWith('#/feedback')) {
    return <PublicFeedbackForm 
      setClientFeedback={async (updater) => {
        if (typeof updater === 'function') {
          const newFeedback = updater(clientFeedback);
          for (const feedback of newFeedback) {
            const existing = clientFeedback.find(f => f.id === feedback.id);
            if (!existing) {
              await insertFeedback(feedback);
            }
          }
        }
      }}
    />;
  }
  if (route.startsWith('#/suggestion-form')) {
    return <SuggestionForm 
      setLeads={async (updater) => {
        if (typeof updater === 'function') {
          const newLeads = updater(leads);
          for (const lead of newLeads) {
            const existing = leads.find(l => l.id === lead.id);
            if (!existing) {
              await insertLead(lead);
            }
          }
        }
      }}
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
        setClientFeedback={async (updater) => {
          if (typeof updater === 'function') {
            const newFeedback = updater(clientFeedback);
            for (const feedback of newFeedback) {
              const existing = clientFeedback.find(f => f.id === feedback.id);
              if (!existing) {
                await insertFeedback(feedback);
              }
            }
          }
        }}
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