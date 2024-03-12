import { config } from '@auth/config';
import { elasticSearchClient } from '@auth/elasticsearch';
import { IHitsTotal, IPaginateProps, IQueryList, ISearchResult, ISellerGig, winstonLogger } from '@dt4real/adwuma-common';
import { GetResponse, SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authService', 'debug');

export async function gigById(index: string, gigId: string): Promise<ISellerGig> {
	try {
		const result: GetResponse = await elasticSearchClient.get({
			index,
			id: gigId
		});
		return result._source as ISellerGig;
	} catch (error) {
		log.log('error', 'AuthService searchService getDocumentById() method error:', error);
		return {} as ISellerGig;
	}
}

export async function gigsSearch(
	searchQuery: string,
	paginate: IPaginateProps,
	deliveryTime?: string,
	min?: number,
	max?: number
): Promise<ISearchResult> {
	const { from, size, type } = paginate;
	const queryList: IQueryList[] = [
		{
			query_string: {
				fields: ['username', 'title', 'description', 'basicDescription', 'basicTitle', 'categories', 'subCategories', 'tags'],
				query: `*${searchQuery}*`
			}
		},
		{
			term: {
				active: true
			}
		}
	];

	if (deliveryTime !== 'undefined') {
		queryList.push({
			query_string: {
				fields: ['expectedDelivery'],
				query: `*${deliveryTime}*`
			}
		});
	}

	if (!isNaN(parseInt(`${min}`)) && !isNaN(parseInt(`${max}`))) {
		queryList.push({
			range: {
				price: {
					gte: min,
					lte: max
				}
			}
		});
	}
	const result: SearchResponse = await elasticSearchClient.search({
		index: 'gigs',
		size,
		query: {
			bool: {
				must: [...queryList]
			}
		},
		sort: [
			{
				sortId: type === 'forward' ? 'asc' : 'desc'
			}
		],
		...(from !== '0' && { search_after: [from] })
	});
	const total: IHitsTotal = result.hits.total as IHitsTotal;
	return {
		total: total.value,
		hits: result.hits.hits
	};
}