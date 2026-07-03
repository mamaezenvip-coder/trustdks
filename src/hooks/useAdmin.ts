import {useEffect, useState} from'react';
import {useAuth} from'@/contexts/AuthContext';
import {supabase} from'@/integrations/supabase/client';

export const useAdmin = () => {
 const {user} = useAuth();
 const [isAdmin, setIsAdmin] = useState(false);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const check = async () => {
 if (!user) {
 setIsAdmin(false);
 setLoading(false);
 return;
}
 const {data} = await supabase
 .rpc('sync_current_user_profile');

 if (data && typeof data ==='object'&& 'is_admin' in data && data.is_admin === true) {
  setIsAdmin(true);
  setLoading(false);
  return;
 }

 const {data: roleData} = await supabase
.from('user_roles')
.select('role')
.eq('user_id', user.id)
.eq('role','admin')
.maybeSingle();
 setIsAdmin(!!roleData);
 setLoading(false);
};
 check();
}, [user]);

 return {isAdmin, loading};
};
