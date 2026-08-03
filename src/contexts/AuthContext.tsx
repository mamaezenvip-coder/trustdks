import {createContext, useContext, useEffect, useState, ReactNode} from'react';
import {supabase} from'@/integrations/supabase/client';
import type {User, Session} from'@supabase/supabase-js';
import {checkRateLimit} from'@/utils/rateLimiter';

interface LicenseInfo {
 isActive: boolean;
 expiresAt: string | null;
 isTrial: boolean;
 daysRemaining: number;
}

interface AuthContextType {
 user: User | null;
 session: Session | null;
 loading: boolean;
 license: LicenseInfo;
 licenseLoading: boolean;
 signOut: () => Promise<void>;
 activateKey: (key: string) => Promise<{success: boolean; message: string}>;
 refreshLicense: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeLicenseKey = (key: string) =>
 key.trim().replace(/["'“”‘’`´\s]/g,'').replace(/[^a-zA-Z0-9-]/g,'').toUpperCase().slice(0, 50);

export const AuthProvider = ({children}: {children: ReactNode}) => {
 const [user, setUser] = useState<User | null>(null);
 const [session, setSession] = useState<Session | null>(null);
 const [loading, setLoading] = useState(true);
 const emptyLicense: LicenseInfo = {isActive: false, expiresAt: null, isTrial: false, daysRemaining: 0};
 const [license, setLicense] = useState<LicenseInfo>(emptyLicense);
 const [licenseLoading, setLicenseLoading] = useState(true);

 const computeDays = (expiresAt: string) => {
 const ms = new Date(expiresAt).getTime() - Date.now();
 return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
};

 const checkLicense = async (userId: string) => {
 setLicenseLoading(true);
 try {
  const {data, error} = await (supabase as any)
 .from('key_activations')
 .select('expires_at, source, status')
 .eq('user_id', userId)
 .order('expires_at', {ascending: false})
 .limit(1)
 .maybeSingle();

 if (error) {
 console.error('License check error:', error);
 setLicense(emptyLicense);
} else if (data && (data.status ?? 'active') === 'active'&& new Date(data.expires_at) > new Date()) {
 setLicense({
 isActive: true,
 expiresAt: data.expires_at,
 isTrial: (data as any).source ==='trial',
 daysRemaining: computeDays(data.expires_at),
});
} else {
 setLicense(emptyLicense);
}
} catch (e) {
 console.error('License check failed:', e);
 setLicense(emptyLicense);
} finally {
 setLicenseLoading(false);
}
};

 const refreshLicense = async () => {
 if (user) await checkLicense(user.id);
};

 const activateKey = async (key: string): Promise<{success: boolean; message: string}> => {
 const {allowed, retryAfterMs} = checkRateLimit('activate-key');
 if (!allowed) {
 const seconds = Math.ceil(retryAfterMs / 1000);
 return {success: false, message:`Too many attempts. Wait ${seconds}s.`};
}

 const sanitizedKey = normalizeLicenseKey(key);
 if (!sanitizedKey) return {success: false, message:'Invalid key format'};

 try {
 const {data, error} = await supabase.rpc('activate_license_key', {
 p_key: sanitizedKey,
 p_device_id: navigator.userAgent.slice(0, 100),
});

 if (error) return {success: false, message: error.message};
 
 const result = data as {success: boolean; message: string; expires_at?: string};
 if (result.success) {
 setLicense({
 isActive: true,
 expiresAt: result.expires_at || null,
 isTrial: false,
 daysRemaining: result.expires_at? computeDays(result.expires_at): 0,
});
}
 return {success: result.success, message: result.message};
} catch (e) {
 return {success: false, message:'Unexpected error'};
}
};

 const signOut = async () => {
 await supabase.auth.signOut();
 setUser(null);
 setSession(null);
 setLicense(emptyLicense);
};

 useEffect(() => {
 const syncUser = async (currentUser: User) => {
  await supabase.rpc('sync_current_user_profile');
  await checkLicense(currentUser.id);
 };

 const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
 setSession(session);
 setUser(session?.user?? null);
 setLoading(false);
 if (session?.user) {
 setTimeout(async () => {
 await syncUser(session.user);
 // Auto-activate pending license key from login flow
 const pendingKey = sessionStorage.getItem('pending_license_key');
 if (pendingKey) {
 sessionStorage.removeItem('pending_license_key');
 const result = await activateKey(pendingKey);
 if (result.success) {
 console.log('Pending license key activated successfully');
}
}
}, 0);
} else {
 setLicense(emptyLicense);
 setLicenseLoading(false);
}
});

 supabase.auth.getSession().then(({data: {session}}) => {
 setSession(session);
 setUser(session?.user?? null);
 setLoading(false);
 if (session?.user) {
 syncUser(session.user);
} else {
 setLicenseLoading(false);
}
});

 return () => subscription.unsubscribe();
}, []);

 return (
 <AuthContext.Provider value={{user, session, loading, license, licenseLoading, signOut, activateKey, refreshLicense}}>
 {children}
 </AuthContext.Provider>
);
};

export const useAuth = () => {
 const context = useContext(AuthContext);
 if (!context) throw new Error('useAuth must be used within AuthProvider');
 return context;
};
