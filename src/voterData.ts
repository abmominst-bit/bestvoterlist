import { Voter, UnionData } from './types';
import { supabase } from './supabaseClient';

// Default unions fallback
export const DEFAULT_UNIONS: UnionData[] = [
  {
    name: 'Baraikhali',
    nameBn: 'বড়ইখালী',
    villages: [
      { name: 'Baraikhali Village', nameBn: 'বড়ইখালী গ্রাম' },
      { name: 'Chonbari', nameBn: 'চনবাড়ী' },
      { name: 'Madhabpur', nameBn: 'মাধবপুর' }
    ]
  },
  {
    name: 'Sreenagar',
    nameBn: 'শ্রীনগর',
    villages: [
      { name: 'Sreenagar Village', nameBn: 'শ্রীনগর গ্রাম' },
      { name: 'Bhagyakul', nameBn: 'ভাগ্যকুল' },
      { name: 'Kamarkhao', nameBn: 'কামারগাঁও' }
    ]
  },
  {
    name: 'Hasara',
    nameBn: 'হাসাড়া',
    villages: [
      { name: 'Hasara Village', nameBn: 'হাসাড়া গ্রাম' },
      { name: 'Laskarpur', nameBn: 'লস্করপুর' },
      { name: 'Kolapara', nameBn: 'ক্যাপাড়া' }
    ]
  },
  {
    name: 'Tantobari',
    nameBn: 'তন্তুবর',
    villages: [
      { name: 'Tantobari Village', nameBn: 'তন্তুবর গ্রাম' },
      { name: 'Gohorpur', nameBn: 'গহরপুর' },
      { name: 'Singpara', nameBn: 'শিংপাড়া' }
    ]
  }
];

// Voters API
export async function getVoters(): Promise<Voter[]> {
  try {
    let allVoters: Voter[] = [];
    let from = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('voters')
        .select('*')
        .order('sl', { ascending: true })
        .range(from, from + pageSize - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        allVoters = [...allVoters, ...data];
        if (data.length < pageSize) {
          hasMore = false;
        } else {
          from += pageSize;
        }
      } else {
        hasMore = false;
      }
    }

    return allVoters;
  } catch (error) {
    console.error('Error fetching voters:', error);
    return [];
  }
}

export async function addVoter(voter: Omit<Voter, 'id'>): Promise<Voter | null> {
  try {
    const { data, error } = await supabase
      .from('voters')
      .insert([voter])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding voter:', error);
    return null;
  }
}

export async function updateVoter(id: string, voter: Partial<Voter>): Promise<Voter | null> {
  try {
    const { data, error } = await supabase
      .from('voters')
      .update(voter)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating voter:', error);
    return null;
  }
}

export async function deleteVoter(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('voters')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting voter:', error);
    return false;
  }
}

export async function deleteVoters(ids: string[]): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('voters')
      .delete()
      .in('id', ids);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error bulk deleting voters:', error);
    return false;
  }
}

// Unions API
export async function getUnions(): Promise<UnionData[]> {
  try {
    const { data, error } = await supabase
      .from('unions')
      .select('*');

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return DEFAULT_UNIONS;
    }

    return data.map((d: any) => ({
      name: d.name,
      nameBn: d.nameBn,
      villages: d.villages || []
    }));
  } catch (error) {
    console.error('Error fetching unions:', error);
    return DEFAULT_UNIONS;
  }
}

export async function saveUnions(unions: UnionData[]): Promise<boolean> {
  try {
    // Delete all existing
    await supabase.from('unions').delete().neq('name', '___none___');
    
    // Insert new
    const { error } = await supabase
      .from('unions')
      .insert(unions);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving unions:', error);
    return false;
  }
}

// Settings API
export async function getSystemSettings(): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('config')
      .eq('id', 'system')
      .single();

    if (error) throw error;
    return data?.config || { maintenanceMode: false };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return { maintenanceMode: false };
  }
}

export async function saveSystemSettings(settings: any): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('settings')
      .upsert({ id: 'system', config: settings });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}
