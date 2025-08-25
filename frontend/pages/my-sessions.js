import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api, bearer, getToken } from '../lib/api';

export default function MySessions(){
  const [items, setItems] = useState([]);
  const [ms
