'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';
import { useRequireRole } from '@/hooks/useProtectedRoute';
import toast from 'react-hot-toast';

export default function CreateCampaign() {
  const router = useRouter();
  const { authorized, user } = useRequireRole('advertiser');

  const initialForm = {
    title: '',
    url: '',
    type: 'Click',
    budget: '',
    cpa: '',
    reward: '',
    status: 'Active',
  };

  const [title, setTitle] = useState(initialForm.title);
  const [type, setType] = useState(initialForm.type);
  const [url, setUrl] = useState(initialForm.url);
  const [budget, setBudget] = useState(initialForm.budget);
  const [cpa, setCpa] = useState(initialForm.cpa);
  const [reward, setReward] = useState(initialForm.reward);
  const [status, setStatus] = useState(initialForm.status);
  const [error] = useState('');

  const handleCreate = async () => {
    if (!title || !url || !budget || !reward || !status) {
      toast.error('Please fill out all required fields.');
      return;
    }

   const { data: campaignData, error: campaignError } = await supabase
  .from('campaigns')
  .insert([
    {
      user_id: user?.id,
      title,
      type,
      url,
      budget: parseFloat(budget),
      cost_per_action: parseFloat(cpa),
      reward: parseFloat(reward),
      status,
    },
  ])
  .select()
  .single();

  // Insert the link after the campaign is created
const { error: linkError } = await supabase.from('links').insert([
  {
    user_id: user?.id,
    url,
    campaign_id: campaignData.campaign_id,
    pay_per_click: campaignData.reward,
    status: campaignData.status
  },
]);

if (linkError) {
  toast.error(linkError.message);
  return;
}

toast.success('Campaign and link created!');
setTimeout(() => router.push('/advertiser'), 1000);
  };
  //  if (campaignError) {
  // toast.error(campaignError.message);
  //   } else {
  //     toast.success('Campaign created!');
  //     setTimeout(() => router.push('/advertiser'), 1000);
  //   }

    


  const handleBack = () => {
    const currentForm = { title, url, type, budget, cpa, reward, status };
    if (JSON.stringify(currentForm) === JSON.stringify(initialForm)) {
      toast('Campaign Not Saved.', {
        icon: '⚠️',
        style: {
          background: '#fef3c7',
          color: '#92400e',
        },
      });
    }
      router.push('/advertiser');
  };

  return (
    <div className="p-6 dark:bg-gray-950 dark:border-white dark:text-white max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Campaign</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Campaign Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Target URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <select
        className="w-full mb-3 p-2 border rounded bg-white dark:bg-gray-900"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="Click">Click</option>
        <option value="Visit">Visit</option>
        <option value="Signup">Signup</option>
      </select>
      <input
        className="w-full mb-3 p-2 border rounded"
        type="number"
        placeholder="Budget (e.g. 10.00)"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />
      <input
        className="w-full mb-3 p-2 border rounded"
        type="number"
        placeholder="Reward (e.g. 0.05)"
        value={reward}
        onChange={(e) => setReward(e.target.value)}
      />
      <input
        className="w-full mb-4 p-2 border rounded"
        type="number"
        placeholder="Cost per Action (e.g. 0.01)"
        value={cpa}
        onChange={(e) => setCpa(e.target.value)}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border mb-4 bg-white dark:bg-gray-900"
      >
        <option value="Active">Active</option>
        <option value="Paused">Paused</option>
      </select>

      <div className="flex mt-3 justify-between">
        <button
          onClick={handleCreate}
          className="bg-green-700 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600"
        >
          Create Campaign
        </button>

        <button
          onClick={handleBack}
          className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-500 cursor-pointer"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
