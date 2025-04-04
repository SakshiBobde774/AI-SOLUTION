import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus, Trash2, Send, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

// Mock SMS service (replace with real SMS service in production)
const mockSendSMS = async (to: string, message: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Sending SMS to ${to}: ${message}`);
      resolve(true);
    }, 1000);
  });
};

const EmergencyContact = () => {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('emergencyContacts');
    return saved ? JSON.parse(saved) : [];
  });
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (contacts.length >= 4) {
      alert('Maximum 4 contacts allowed');
      return;
    }
    if (newContact.name && newContact.phone) {
      setContacts([...contacts, { ...newContact, id: Date.now().toString() }]);
      setNewContact({ name: '', phone: '' });
    }
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const handleEmergency = async () => {
    if (contacts.length === 0) {
      alert('Please add at least one emergency contact');
      return;
    }

    setIsSending(true);
    const message = "EMERGENCY: I need help! This is an emergency message.";

    try {
      await Promise.all(
        contacts.map(contact => mockSendSMS(contact.phone, message))
      );
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error sending messages:', error);
      alert('Failed to send emergency messages');
    }
    setIsSending(false);
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-slate-700 rounded-xl">
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="bg-red-500 p-3 rounded-lg"
        >
          <AlertCircle className="w-6 h-6" />
        </motion.div>
        <h3 className="text-2xl font-semibold">Emergency Contacts</h3>
      </div>

      <form onSubmit={handleAddContact} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Contact Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            maxLength={50}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            pattern="[0-9]+"
            maxLength={15}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded-lg flex items-center justify-center gap-2 transition"
          disabled={contacts.length >= 4}
        >
          <Plus className="w-5 h-5" />
          Add Contact
        </motion.button>
      </form>

      <div className="space-y-3">
        <AnimatePresence>
          {contacts.map(contact => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-slate-800 p-4 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-400">{contact.phone}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDeleteContact(contact.id)}
                className="text-red-400 hover:text-red-300 transition"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleEmergency}
        disabled={isSending || contacts.length === 0}
        className={`w-full p-4 rounded-lg flex items-center justify-center gap-2 transition ${
          contacts.length === 0
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {isSending ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Send className="w-5 h-5" />
          </motion.div>
        ) : (
          <Send className="w-5 h-5" />
        )}
        {isSending ? 'Sending Emergency Messages...' : 'Send Emergency Message'}
      </motion.button>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-500/20 text-green-400 p-4 rounded-lg text-center"
          >
            Emergency messages sent successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmergencyContact;