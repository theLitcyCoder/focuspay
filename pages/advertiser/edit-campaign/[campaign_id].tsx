'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRequireRole } from '@/hooks/useProtectedRoute';
import toast from 'react-hot-toast';


export default function EditCampaign() {
  const router = useRouter();
  // const { campaign_id } = router.query;
  const [campaign, setCampaign] = useState<any>(null);
   const [user, setUser] = useState<any>(null);
  const { campaign_id: campaignId } = router.query;
  const { authorized, checking } = useRequireRole('advertiser');
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    url: '',
    budget: '',
    cost_per_action: '',
    reward: '',
    status: '',
  });
 const [originalData, setOriginalData] = useState({ ...formData });
console.log('Rendering EditCampaignPage with ID:', campaignId);

  useEffect(() => {
    const fetchUserAndCampaign = async () => {
          if (!campaignId || typeof campaignId !== 'string') return;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user);

      if (!session?.user) return;

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('user_id', session.user.id) // ✅ Only allow own campaign
        .single();

      if (data) {
        setFormData({
          title: data.title,
          type: data.type,
          url: data.url,
          budget: data.budget,
          cost_per_action: data.cost_per_action,
          reward: data.reward,
          status: data.status,
        });
        setOriginalData({
          title: data.title,
          type: data.type,
          url: data.url,
          budget: data.budget,
          cost_per_action: data.cost_per_action,
          reward: data.reward,
          status: data.status,
        });
        setCampaign(data);
      } else {
        toast.error('Error fetching campaign');
      }
    };

    // if (authorized && campaignId) fetchUserAndCampaign();
    
  if (authorized && router.isReady) {
    fetchUserAndCampaign();
  }
  // }, [authorized, campaignId]);
  }, [authorized, router.isReady, campaignId]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('campaigns')
      .update(formData)
      .eq('campaign_id', campaignId)
      .eq('user_id', user.id); // ✅ Ensure owner is updating

    if (error) {
      toast.error('Error updating campaign');
    } else {
      if (JSON.stringify(formData) === JSON.stringify(originalData)) {
        toast('No changes made.', {
          icon: 'ℹ️',
          style: { background: '#5695f5', color: '#fff' },
        });
      } else {
        toast.success('Campaign updated!');
      }
      router.push('/advertiser');
    }
  };

  if (checking || !authorized) return <p>Checking permissions...</p>;
  // if (!campaign) return <p>Loading campaign...</p>;
if (!campaign && router.isReady) return <p>Loading campaign...</p>;



  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto text-black dark:text-white dark:bg-gray-950">
      <h1 className="text-2xl font-bold mb-4">Edit Campaign</h1>

      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        placeholder="Title"
      />

      <input
        name="url"
        value={formData.url}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        placeholder="URL"
      />

      <select
        className="w-full mb-3 p-2 border rounded bg-white dark:bg-gray-900"
        name="type"
        value={formData.type}
        onChange={handleChange}
      >
        <option value="Click">Click</option>
        <option value="Visit">Visit</option>
        <option value="Signup">Signup</option>
      </select>

      <input
        name="budget"
        type="number"
        value={formData.budget}
        onChange={handleChange}
        className="w-full p-2 border mb-4"
        placeholder="Budget"
      />

      <input
        name="cost_per_action"
        type="number"
        value={formData.cost_per_action}
        onChange={handleChange}
        className="w-full p-2 border mb-4"
        placeholder="cost_per_action"
      />

      <input
        name="reward"
        type="number"
        value={formData.reward}
        onChange={handleChange}
        className="w-full p-2 border mb-4"
        placeholder="reward"
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full p-2 border mb-4 bg-white dark:bg-gray-900"
      >
        <option value="Active">Active</option>
        <option value="Paused">Paused</option>
      </select>

      <div className="flex mt-3 justify-between">
        <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
          Save Changes
        </button>

        <button
          onClick={() => router.push('/advertiser')}
          className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-500 cursor-pointer"
        >
          ← Back to Dashboard
        </button>
      </div>
    </form>
  );
}
