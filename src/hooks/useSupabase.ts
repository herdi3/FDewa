import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Client, Project, TeamMember, Transaction, Package, AddOn, 
  Card, FinancialPocket, Lead, Asset, Contract, ClientFeedback,
  SocialMediaPost, PromoCode, SOP, Notification, User, Profile,
  TransactionType, PaymentStatus, ClientStatus, LeadStatus,
  ContactChannel, AssetStatus, PostStatus, PostType, RevisionStatus,
  SatisfactionLevel, PerformanceNoteType, PocketType, CardType, ClientType
} from '../types';

// Transform functions to convert between database and app formats
const transformDbClient = (dbClient: any): Client => ({
  id: dbClient.id,
  name: dbClient.name,
  email: dbClient.email,
  phone: dbClient.phone,
  instagram: dbClient.instagram || '',
  since: dbClient.since,
  status: dbClient.status as ClientStatus,
  clientType: (dbClient.client_type as ClientType) || ClientType.DIRECT,
  lastContact: dbClient.last_contact,
  portalAccessId: dbClient.portal_access_id
});

const transformDbProject = (dbProject: any): Project => ({
  id: dbProject.id,
  projectName: dbProject.project_name,
  clientName: dbProject.client_name,
  clientId: dbProject.client_id,
  projectType: dbProject.project_type,
  packageName: dbProject.package_name,
  packageId: dbProject.package_id,
  addOns: dbProject.add_ons || [],
  date: dbProject.date,
  deadlineDate: dbProject.deadline_date,
  location: dbProject.location,
  progress: dbProject.progress || 0,
  status: dbProject.status,
  activeSubStatuses: dbProject.active_sub_statuses || [],
  totalCost: parseFloat(dbProject.total_cost) || 0,
  amountPaid: parseFloat(dbProject.amount_paid) || 0,
  paymentStatus: dbProject.payment_status as PaymentStatus,
  team: dbProject.team || [],
  notes: dbProject.notes,
  accommodation: dbProject.accommodation,
  driveLink: dbProject.drive_link,
  clientDriveLink: dbProject.client_drive_link,
  finalDriveLink: dbProject.final_drive_link,
  startTime: dbProject.start_time,
  endTime: dbProject.end_time,
  image: dbProject.image,
  revisions: dbProject.revisions || [],
  promoCodeId: dbProject.promo_code_id,
  discountAmount: parseFloat(dbProject.discount_amount) || undefined,
  shippingDetails: dbProject.shipping_details,
  dpProofUrl: dbProject.dp_proof_url,
  printingDetails: dbProject.printing_details || [],
  printingCost: parseFloat(dbProject.printing_cost) || 0,
  transportCost: parseFloat(dbProject.transport_cost) || 0,
  isEditingConfirmedByClient: dbProject.is_editing_confirmed_by_client || false,
  isPrintingConfirmedByClient: dbProject.is_printing_confirmed_by_client || false,
  isDeliveryConfirmedByClient: dbProject.is_delivery_confirmed_by_client || false,
  confirmedSubStatuses: dbProject.confirmed_sub_statuses || [],
  clientSubStatusNotes: dbProject.client_sub_status_notes || {},
  subStatusConfirmationSentAt: dbProject.sub_status_confirmation_sent_at || {},
  completedDigitalItems: dbProject.completed_digital_items || [],
  invoiceSignature: dbProject.invoice_signature
});

const transformDbTransaction = (dbTransaction: any): Transaction => ({
  id: dbTransaction.id,
  date: dbTransaction.date,
  description: dbTransaction.description,
  amount: parseFloat(dbTransaction.amount),
  type: dbTransaction.type as TransactionType,
  projectId: dbTransaction.project_id,
  category: dbTransaction.category,
  method: dbTransaction.method,
  pocketId: dbTransaction.pocket_id,
  cardId: dbTransaction.card_id,
  printingItemId: dbTransaction.printing_item_id,
  vendorSignature: dbTransaction.vendor_signature
});

const transformDbTeamMember = (dbMember: any): TeamMember => ({
  id: dbMember.id,
  name: dbMember.name,
  role: dbMember.role,
  email: dbMember.email,
  phone: dbMember.phone,
  standardFee: parseFloat(dbMember.standard_fee),
  noRek: dbMember.no_rek,
  rewardBalance: parseFloat(dbMember.reward_balance) || 0,
  rating: dbMember.rating || 5,
  performanceNotes: dbMember.performance_notes || [],
  portalAccessId: dbMember.portal_access_id
});

const transformDbPackage = (dbPackage: any): Package => ({
  id: dbPackage.id,
  name: dbPackage.name,
  price: parseFloat(dbPackage.price),
  description: dbPackage.description,
  physicalItems: [],
  digitalItems: [],
  processingTime: '30 hari kerja',
  photographers: '',
  videographers: ''
});

const transformDbAddOn = (dbAddOn: any): AddOn => ({
  id: dbAddOn.id,
  name: dbAddOn.name,
  price: parseFloat(dbAddOn.price)
});

const transformDbCard = (dbCard: any): Card => ({
  id: dbCard.id,
  cardHolderName: dbCard.card_holder_name,
  bankName: dbCard.bank_name,
  cardType: dbCard.card_type as CardType,
  lastFourDigits: dbCard.last_four_digits,
  expiryDate: dbCard.expiry_date,
  balance: parseFloat(dbCard.balance) || 0,
  colorGradient: dbCard.color_gradient
});

const transformDbPocket = (dbPocket: any): FinancialPocket => ({
  id: dbPocket.id,
  name: dbPocket.name,
  description: dbPocket.description,
  icon: dbPocket.icon as any,
  type: dbPocket.type as PocketType,
  amount: parseFloat(dbPocket.amount) || 0,
  goalAmount: dbPocket.goal_amount ? parseFloat(dbPocket.goal_amount) : undefined,
  lockEndDate: dbPocket.lock_end_date,
  sourceCardId: dbPocket.source_card_id
});

const transformDbLead = (dbLead: any): Lead => ({
  id: dbLead.id,
  name: dbLead.name,
  contactChannel: dbLead.contact_channel as ContactChannel,
  location: dbLead.location,
  status: dbLead.status as LeadStatus,
  date: dbLead.date,
  notes: dbLead.notes
});

const transformDbAsset = (dbAsset: any): Asset => ({
  id: dbAsset.id,
  name: dbAsset.name,
  category: dbAsset.category,
  purchaseDate: dbAsset.purchase_date,
  purchasePrice: parseFloat(dbAsset.purchase_price),
  serialNumber: dbAsset.serial_number,
  status: dbAsset.status as AssetStatus,
  notes: dbAsset.notes
});

const transformDbContract = (dbContract: any): Contract => ({
  id: dbContract.id,
  contractNumber: dbContract.contract_number,
  clientId: dbContract.client_id,
  projectId: dbContract.project_id,
  signingDate: dbContract.signing_date,
  signingLocation: dbContract.signing_location,
  clientName1: dbContract.client_name1,
  clientAddress1: dbContract.client_address1,
  clientPhone1: dbContract.client_phone1,
  clientName2: dbContract.client_name2 || '',
  clientAddress2: dbContract.client_address2 || '',
  clientPhone2: dbContract.client_phone2 || '',
  shootingDuration: dbContract.shooting_duration,
  guaranteedPhotos: dbContract.guaranteed_photos,
  albumDetails: dbContract.album_details,
  digitalFilesFormat: dbContract.digital_files_format,
  otherItems: dbContract.other_items,
  personnelCount: dbContract.personnel_count,
  deliveryTimeframe: dbContract.delivery_timeframe,
  dpDate: dbContract.dp_date,
  finalPaymentDate: dbContract.final_payment_date,
  cancellationPolicy: dbContract.cancellation_policy,
  jurisdiction: dbContract.jurisdiction,
  createdAt: dbContract.created_at,
  vendorSignature: dbContract.vendor_signature,
  clientSignature: dbContract.client_signature
});

const transformDbFeedback = (dbFeedback: any): ClientFeedback => ({
  id: dbFeedback.id,
  clientName: dbFeedback.client_name,
  satisfaction: dbFeedback.satisfaction as SatisfactionLevel,
  rating: dbFeedback.rating,
  feedback: dbFeedback.feedback,
  date: dbFeedback.date
});

const transformDbPost = (dbPost: any): SocialMediaPost => ({
  id: dbPost.id,
  projectId: dbPost.project_id,
  clientName: dbPost.client_name,
  postType: dbPost.post_type as PostType,
  platform: dbPost.platform as any,
  scheduledDate: dbPost.scheduled_date,
  caption: dbPost.caption,
  mediaUrl: dbPost.media_url,
  status: dbPost.status as PostStatus,
  notes: dbPost.notes
});

const transformDbPromoCode = (dbPromo: any): PromoCode => ({
  id: dbPromo.id,
  code: dbPromo.code,
  discountType: dbPromo.discount_type as any,
  discountValue: parseFloat(dbPromo.discount_value),
  isActive: dbPromo.is_active,
  usageCount: dbPromo.usage_count || 0,
  maxUsage: dbPromo.max_usage,
  expiryDate: dbPromo.expiry_date,
  createdAt: dbPromo.created_at
});

const transformDbNotification = (dbNotif: any): Notification => ({
  id: dbNotif.id,
  title: dbNotif.title,
  message: dbNotif.message,
  timestamp: dbNotif.timestamp,
  isRead: dbNotif.is_read || false,
  icon: dbNotif.icon as any,
  linkView: dbNotif.link_view as ViewType,
  linkAction: dbNotif.link_action
});

// Generic hook for CRUD operations
export function useSupabaseTable<T extends { id: string }>(
  tableName: string, 
  transformFn: (dbItem: any) => T,
  toDbFn: (item: Partial<T>) => any
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData((result || []).map(transformFn));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(`Error fetching ${tableName}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const insert = async (item: Omit<T, 'id'>) => {
    try {
      const dbItem = toDbFn(item);
      const { data: result, error } = await supabase
        .from(tableName)
        .insert([dbItem])
        .select()
        .single();

      if (error) throw error;
      const newItem = transformFn(result);
      setData(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      console.error(`Error inserting ${tableName}:`, err);
      throw new Error(err instanceof Error ? err.message : 'Insert failed');
    }
  };

  const update = async (id: string, updates: Partial<T>) => {
    try {
      const dbUpdates = toDbFn(updates);
      const { data: result, error } = await supabase
        .from(tableName)
        .update({ ...dbUpdates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      const updatedItem = transformFn(result);
      setData(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      console.error(`Error updating ${tableName}:`, err);
      throw new Error(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const remove = async (id: string) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(`Error deleting ${tableName}:`, err);
      throw new Error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableName]);

  return {
    data,
    loading,
    error,
    insert,
    update,
    remove,
    refetch: fetchData
  };
}

// Specific hooks for each entity
export const useClients = () => useSupabaseTable<Client>(
  'clients',
  transformDbClient,
  (client: Partial<Client>) => ({
    name: client.name,
    email: client.email,
    phone: client.phone,
    instagram: client.instagram,
    since: client.since,
    status: client.status,
    client_type: client.clientType,
    last_contact: client.lastContact,
    portal_access_id: client.portalAccessId
  })
);

export const useProjects = () => useSupabaseTable<Project>(
  'projects',
  transformDbProject,
  (project: Partial<Project>) => ({
    project_name: project.projectName,
    client_name: project.clientName,
    client_id: project.clientId,
    project_type: project.projectType,
    package_name: project.packageName,
    package_id: project.packageId,
    add_ons: project.addOns,
    date: project.date,
    deadline_date: project.deadlineDate,
    location: project.location,
    progress: project.progress,
    status: project.status,
    active_sub_statuses: project.activeSubStatuses,
    total_cost: project.totalCost,
    amount_paid: project.amountPaid,
    payment_status: project.paymentStatus,
    team: project.team,
    notes: project.notes,
    accommodation: project.accommodation,
    drive_link: project.driveLink,
    client_drive_link: project.clientDriveLink,
    final_drive_link: project.finalDriveLink,
    start_time: project.startTime,
    end_time: project.endTime,
    image: project.image,
    revisions: project.revisions,
    promo_code_id: project.promoCodeId,
    discount_amount: project.discountAmount,
    shipping_details: project.shippingDetails,
    dp_proof_url: project.dpProofUrl,
    printing_details: project.printingDetails,
    printing_cost: project.printingCost,
    transport_cost: project.transportCost,
    is_editing_confirmed_by_client: project.isEditingConfirmedByClient,
    is_printing_confirmed_by_client: project.isPrintingConfirmedByClient,
    is_delivery_confirmed_by_client: project.isDeliveryConfirmedByClient,
    confirmed_sub_statuses: project.confirmedSubStatuses,
    client_sub_status_notes: project.clientSubStatusNotes,
    sub_status_confirmation_sent_at: project.subStatusConfirmationSentAt,
    completed_digital_items: project.completedDigitalItems,
    invoice_signature: project.invoiceSignature
  })
);

export const useTeamMembers = () => useSupabaseTable<TeamMember>(
  'team_members',
  transformDbTeamMember,
  (member: Partial<TeamMember>) => ({
    name: member.name,
    role: member.role,
    email: member.email,
    phone: member.phone,
    standard_fee: member.standardFee,
    no_rek: member.noRek,
    reward_balance: member.rewardBalance,
    rating: member.rating,
    performance_notes: member.performanceNotes,
    portal_access_id: member.portalAccessId
  })
);

export const useTransactions = () => useSupabaseTable<Transaction>(
  'transactions',
  transformDbTransaction,
  (transaction: Partial<Transaction>) => ({
    date: transaction.date,
    description: transaction.description,
    amount: transaction.amount,
    type: transaction.type,
    project_id: transaction.projectId,
    category: transaction.category,
    method: transaction.method,
    pocket_id: transaction.pocketId,
    card_id: transaction.cardId,
    printing_item_id: transaction.printingItemId,
    vendor_signature: transaction.vendorSignature
  })
);

export const usePackages = () => useSupabaseTable<Package>(
  'packages',
  transformDbPackage,
  (pkg: Partial<Package>) => ({
    name: pkg.name,
    price: pkg.price,
    description: pkg.description
  })
);

export const useAddOns = () => useSupabaseTable<AddOn>(
  'add_ons',
  transformDbAddOn,
  (addOn: Partial<AddOn>) => ({
    name: addOn.name,
    price: addOn.price
  })
);

export const useCards = () => useSupabaseTable<Card>(
  'cards',
  transformDbCard,
  (card: Partial<Card>) => ({
    card_holder_name: card.cardHolderName,
    bank_name: card.bankName,
    card_type: card.cardType,
    last_four_digits: card.lastFourDigits,
    expiry_date: card.expiryDate,
    balance: card.balance,
    color_gradient: card.colorGradient
  })
);

export const useFinancialPockets = () => useSupabaseTable<FinancialPocket>(
  'financial_pockets',
  transformDbPocket,
  (pocket: Partial<FinancialPocket>) => ({
    name: pocket.name,
    description: pocket.description,
    icon: pocket.icon,
    type: pocket.type,
    amount: pocket.amount,
    goal_amount: pocket.goalAmount,
    lock_end_date: pocket.lockEndDate,
    source_card_id: pocket.sourceCardId
  })
);

export const useLeads = () => useSupabaseTable<Lead>(
  'leads',
  transformDbLead,
  (lead: Partial<Lead>) => ({
    name: lead.name,
    contact_channel: lead.contactChannel,
    location: lead.location,
    status: lead.status,
    date: lead.date,
    notes: lead.notes
  })
);

export const useAssets = () => useSupabaseTable<Asset>(
  'assets',
  transformDbAsset,
  (asset: Partial<Asset>) => ({
    name: asset.name,
    category: asset.category,
    purchase_date: asset.purchaseDate,
    purchase_price: asset.purchasePrice,
    serial_number: asset.serialNumber,
    status: asset.status,
    notes: asset.notes
  })
);

export const useContracts = () => useSupabaseTable<Contract>(
  'contracts',
  transformDbContract,
  (contract: Partial<Contract>) => ({
    contract_number: contract.contractNumber,
    client_id: contract.clientId,
    project_id: contract.projectId,
    signing_date: contract.signingDate,
    signing_location: contract.signingLocation,
    client_name1: contract.clientName1,
    client_address1: contract.clientAddress1,
    client_phone1: contract.clientPhone1,
    client_name2: contract.clientName2,
    client_address2: contract.clientAddress2,
    client_phone2: contract.clientPhone2,
    shooting_duration: contract.shootingDuration,
    guaranteed_photos: contract.guaranteedPhotos,
    album_details: contract.albumDetails,
    digital_files_format: contract.digitalFilesFormat,
    other_items: contract.otherItems,
    personnel_count: contract.personnelCount,
    delivery_timeframe: contract.deliveryTimeframe,
    dp_date: contract.dpDate,
    final_payment_date: contract.finalPaymentDate,
    cancellation_policy: contract.cancellationPolicy,
    jurisdiction: contract.jurisdiction,
    vendor_signature: contract.vendorSignature,
    client_signature: contract.clientSignature
  })
);

export const useClientFeedback = () => useSupabaseTable<ClientFeedback>(
  'client_feedback',
  transformDbFeedback,
  (feedback: Partial<ClientFeedback>) => ({
    client_name: feedback.clientName,
    satisfaction: feedback.satisfaction,
    rating: feedback.rating,
    feedback: feedback.feedback,
    date: feedback.date
  })
);

export const useSocialMediaPosts = () => useSupabaseTable<SocialMediaPost>(
  'social_media_posts',
  transformDbPost,
  (post: Partial<SocialMediaPost>) => ({
    project_id: post.projectId,
    client_name: post.clientName,
    post_type: post.postType,
    platform: post.platform,
    scheduled_date: post.scheduledDate,
    caption: post.caption,
    media_url: post.mediaUrl,
    status: post.status,
    notes: post.notes
  })
);

export const usePromoCodes = () => useSupabaseTable<PromoCode>(
  'promo_codes',
  transformDbPromoCode,
  (promo: Partial<PromoCode>) => ({
    code: promo.code,
    discount_type: promo.discountType,
    discount_value: promo.discountValue,
    is_active: promo.isActive,
    usage_count: promo.usageCount,
    max_usage: promo.maxUsage,
    expiry_date: promo.expiryDate
  })
);

export const useSOPs = () => useSupabaseTable<SOP>(
  'sops',
  (dbSOP: any) => ({
    id: dbSOP.id,
    title: dbSOP.title,
    category: dbSOP.category,
    content: dbSOP.content,
    lastUpdated: dbSOP.updated_at
  }),
  (sop: Partial<SOP>) => ({
    title: sop.title,
    category: sop.category,
    content: sop.content
  })
);

export const useNotifications = () => useSupabaseTable<Notification>(
  'notifications',
  transformDbNotification,
  (notif: Partial<Notification>) => ({
    title: notif.title,
    message: notif.message,
    timestamp: notif.timestamp,
    is_read: notif.isRead,
    icon: notif.icon,
    link_view: notif.linkView,
    link_action: notif.linkAction
  })
);

// Authentication hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a stored session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // For demo purposes, we'll use the existing users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        return { user: null, error: 'User not found' };
      }

      // Simple password check (in production, use proper hashing)
      if (userData.password === password) {
        const user: User = {
          id: userData.id,
          email: userData.email,
          password: userData.password,
          fullName: userData.full_name,
          role: userData.role,
          permissions: userData.permissions
        };
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { user, error: null };
      } else {
        return { user: null, error: 'Invalid credentials' };
      }
    } catch (err) {
      return { user: null, error: err instanceof Error ? err.message : 'Sign in failed' };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return {
    user,
    loading,
    signIn,
    signOut
  };
}

// Profile hook
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .single();

      if (error) throw error;
      
      // Transform database format to app format
      const transformedProfile: Profile = {
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        companyName: data.company_name,
        website: data.website || '',
        address: data.address,
        bankAccount: data.bank_account,
        authorizedSigner: data.authorized_signer,
        idNumber: data.id_number || '',
        bio: data.bio || '',
        incomeCategories: data.income_categories || [],
        expenseCategories: data.expense_categories || [],
        projectTypes: data.project_types || [],
        eventTypes: data.event_types || [],
        assetCategories: data.asset_categories || [],
        sopCategories: data.sop_categories || [],
        projectStatusConfig: data.project_status_config || [],
        notificationSettings: data.notification_settings || {
          newProject: true,
          paymentConfirmation: true,
          deadlineReminder: true
        },
        securitySettings: data.security_settings || {
          twoFactorEnabled: false
        },
        briefingTemplate: data.briefing_template || '',
        termsAndConditions: data.terms_and_conditions || ''
      };

      setProfile(transformedProfile);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      // Transform app format to database format
      const dbUpdates: any = {};
      if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.companyName !== undefined) dbUpdates.company_name = updates.companyName;
      if (updates.website !== undefined) dbUpdates.website = updates.website;
      if (updates.address !== undefined) dbUpdates.address = updates.address;
      if (updates.bankAccount !== undefined) dbUpdates.bank_account = updates.bankAccount;
      if (updates.authorizedSigner !== undefined) dbUpdates.authorized_signer = updates.authorizedSigner;
      if (updates.idNumber !== undefined) dbUpdates.id_number = updates.idNumber;
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
      if (updates.incomeCategories !== undefined) dbUpdates.income_categories = updates.incomeCategories;
      if (updates.expenseCategories !== undefined) dbUpdates.expense_categories = updates.expenseCategories;
      if (updates.projectTypes !== undefined) dbUpdates.project_types = updates.projectTypes;
      if (updates.eventTypes !== undefined) dbUpdates.event_types = updates.eventTypes;
      if (updates.assetCategories !== undefined) dbUpdates.asset_categories = updates.assetCategories;
      if (updates.sopCategories !== undefined) dbUpdates.sop_categories = updates.sopCategories;
      if (updates.projectStatusConfig !== undefined) dbUpdates.project_status_config = updates.projectStatusConfig;
      if (updates.notificationSettings !== undefined) dbUpdates.notification_settings = updates.notificationSettings;
      if (updates.securitySettings !== undefined) dbUpdates.security_settings = updates.securitySettings;
      if (updates.briefingTemplate !== undefined) dbUpdates.briefing_template = updates.briefingTemplate;
      if (updates.termsAndConditions !== undefined) dbUpdates.terms_and_conditions = updates.termsAndConditions;

      dbUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('user_profiles')
        .update(dbUpdates)
        .eq('id', profile?.id || '');

      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      console.error('Error updating profile:', err);
      throw new Error(err instanceof Error ? err.message : 'Profile update failed');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile
  };
}