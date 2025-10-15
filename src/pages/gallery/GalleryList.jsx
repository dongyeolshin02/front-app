import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

const GalleryList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: 'all' });
  const observerRef = useRef();

  // API 호출 함수
  const fetchImages = async ({ pageParam = 1, queryKey }) => {
    const [, search, filterParams] = 1;
    
    // 실제 API 엔드포인트로 교체하세요
    const params = new URLSearchParams({
      page: pageParam,
      limit: 8,
      search: search || '',
      category: filterParams.category,
    });

    // Mock API 시뮬레이션 (실제로는 fetch로 교체)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 검색어가 있을 때 필터링 시뮬레이션
    const filteredCount = search ? Math.max(0, 40 - (pageParam - 1) * 8) : 40;
    const hasNextPage = (pageParam * 8) < filteredCount;
    
    const images = Array.from({ length: Math.min(8, filteredCount - (pageParam - 1) * 8) }, (_, index) => {
      const imageId = (pageParam - 1) * 8 + index + 1;
      return {
        id: `${search}-${filterParams.category}-${imageId}`,
        title: search ? `${search} Image ${imageId}` : `Gallery Image ${imageId}`,
        imageUrl: `https://picsum.photos/300/200?random=${imageId + Math.random()}`,
        description: `Description for ${search || 'gallery'} image ${imageId}`,
        category: filterParams.category,
        likes: Math.floor(Math.random() * 100),
        views: Math.floor(Math.random() * 1000),
      };
    });

    return {
      images,
      nextPage: hasNextPage ? pageParam + 1 : undefined,
      hasNextPage,
      totalCount: filteredCount,
    };
  };

  // React Query Infinite Query
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['images', searchQuery, filters],
    queryFn: fetchImages,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000, // 5분 캐싱
    cacheTime: 10 * 60 * 1000, // 10분 캐시 유지
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Intersection Observer를 사용한 무한 스크롤
  const lastImageRef = useCallback((node) => {
    if (isFetchingNextPage) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px',
    });
    
    if (node) observerRef.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, isFetching, fetchNextPage]);

  // 검색 핸들러
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get('search');
    setSearchQuery(search);
  }, []);

  // 필터 변경 핸들러
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // 이미지 액션 핸들러들
  const handleLike = useCallback((imageId) => {
    console.log('Like image:', imageId);
    // 실제로는 mutation을 사용해서 서버에 업데이트
  }, []);

  const handleView = useCallback((imageId) => {
    console.log('View image:', imageId);
    // 실제로는 상세 페이지로 이동 또는 모달 열기
  }, []);

  // 에러 재시도
  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // 모든 페이지의 이미지들을 평면화
  const allImages = data?.pages?.flatMap(page => page.images) ?? [];
  const totalCount = data?.pages?.[0]?.totalCount ?? 0;

  return (
    <div className="container py-4">
      {/* 헤더 및 검색 */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center mb-4">이미지 갤러리</h1>
          
          {/* 검색 폼 */}
          <form onSubmit={handleSearch} className="mb-3">
            <div className="input-group">
              <input
                type="text"
                name="search"
                className="form-control"
                placeholder="이미지 검색..."
                defaultValue={searchQuery}
              />
              <button className="btn btn-primary" type="submit">
                검색
              </button>
            </div>
          </form>

          {/* 필터 */}
          <div className="d-flex gap-2 mb-3 flex-wrap">
            {['all', 'nature', 'city', 'people', 'abstract'].map((category) => (
              <button
                key={category}
                className={`btn btn-sm ${
                  filters.category === category ? 'btn-primary' : 'btn-outline-primary'
                }`}
                onClick={() => handleFilterChange({ category })}
              >
                {category === 'all' ? '전체' : category}
              </button>
            ))}
          </div>

          {/* 결과 정보 */}
          {status === 'success' && (
            <div className="d-flex justify-content-between align-items-center mb-3">
              <small className="text-muted">
                총 {totalCount}개 이미지 중 {allImages.length}개 표시
                {searchQuery && ` - "${searchQuery}" 검색 결과`}
              </small>
              {searchQuery && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setSearchQuery('')}
                >
                  검색 초기화
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 로딩 상태 (초기 로딩) */}
      {status === 'loading' && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">이미지를 불러오는 중...</p>
        </div>
      )}

      {/* 에러 상태 */}
      {status === 'error' && (
        <div className="text-center py-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">오류가 발생했습니다</h4>
            <p>이미지를 불러오는 중 문제가 발생했습니다.</p>
            <p className="text-muted small">{error?.message}</p>
            <hr />
            <button className="btn btn-primary" onClick={handleRetry}>
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* 이미지 그리드 */}
      {status === 'success' && (
        <>
          {allImages.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">검색 결과가 없습니다.</p>
              <button
                className="btn btn-outline-primary"
                onClick={() => setSearchQuery('')}
              >
                전체 이미지 보기
              </button>
            </div>
          ) : (
            <div className="row">
              {allImages.map((image, index) => (
                <div
                  key={image.id}
                  className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4"
                  ref={index === allImages.length - 1 ? lastImageRef : null}
                >
                  <div className="card h-100 shadow-sm">
                    <div className="position-relative">
                      <img
                        src={image.imageUrl}
                        className="card-img-top"
                        alt={image.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                        loading="lazy"
                      />
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-primary">{image.category}</span>
                      </div>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{image.title}</h5>
                      <p className="card-text flex-grow-1 small">
                        {image.description}
                      </p>
                      <div className="d-flex justify-content-between align-items-center text-muted small mb-2">
                        <span>❤️ {image.likes}</span>
                        <span>👁️ {image.views}</span>
                      </div>
                      <div className="mt-auto">
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleView(image.id)}
                        >
                          보기
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleLike(image.id)}
                        >
                          ❤️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 다음 페이지 로딩 */}
          {isFetchingNextPage && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">더 많은 이미지를 불러오는 중...</p>
            </div>
          )}

          {/* 더 이상 데이터가 없을 때 */}
          {!hasNextPage && allImages.length > 0 && (
            <div className="text-center py-4">
              <p className="text-muted">모든 이미지를 불러왔습니다.</p>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                맨 위로
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GalleryList;