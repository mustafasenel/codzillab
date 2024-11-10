import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Hash, TagIcon, TrendingUp } from 'lucide-react'; // LucideReact ikonları
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag } from '@prisma/client';
import { FullTagType } from '@/types';

const TagList = () => {
    const [tags, setTags] = useState<FullTagType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get('/api/tags'); // Tagleri çeken API
                setTags(response.data);
            } catch (err) {
                setError('Tagler yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <TagIcon className="mr-2 w-4 h-4" />
                    <span>Trendler</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-10 w-full" />
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <ul className="space-y-2">
                        {tags.map(tag => (
                            <li key={tag.id} className="flex gap-4">
                                <div className='flex items-center justify-center bg-secondary p-2 rounded-md'>
                                    <Hash className='w-4 h-4'/>
                                </div>
                                <div className='flex flex-col items-start justify-center'>
                                    <span className="text-sm">{tag.name}</span>
                                    <span className='text-muted-foreground text-xs'>{`${tag.posts.length} post`}</span>

                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
};

export default TagList;
