import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IComment } from '../comment/comment.model';

@Component({
  selector: 'jhi-leaderboards',
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.scss'],
})
export class LeaderboardsComponent implements OnInit {
  highestLikedComment: IComment | null = null;
  comment: IComment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comment }) => {
      this.comment = comment;
    });
    //     // 找出点赞数最高的评论
    //     this.highestLikedComment = this.comment.reduce((prev: IComment | null, current: IComment) => {
    //       if (!prev || (current.likeCount !== undefined && typeof prev.likeCount === 'number' && !current.likeCount > !prev.likeCount)) {
    //         return current;
    //       } else {
    //         return prev;
    //       }
    //     }, null);
    //
    //     // 检查是否找到了点赞数最高的评论
    //     if (this.highestLikedComment) {
    //       console.log('点赞数最高的评论是:', this.highestLikedComment);
    //     } else {
    //       console.log('没有评论或没有点赞');
    //     }
  }
}
